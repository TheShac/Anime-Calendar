import { successResponse, errorResponse } from "../../utils/apiResponse.js";
import { db } from "../../config/db.js";
import { animes } from "../animes/anime.schema.js";
import { calendarEntries } from "../calendar/calendar.schema.js";
import { eq, and } from "drizzle-orm";
import { JikanError } from "./jikan.client.js";
import { anilistSeasonPlatforms, anilistPlatform } from "./anilist.client.js";
import { searchAnime as fetchSearch, getAnime, getSeasonPage } from "./anime.provider.js";

const jikanFail = (res, error, fallback) =>
  error instanceof JikanError
    ? errorResponse(res, error.message, error.notFound ? 404 : error.status)
    : errorResponse(res, fallback, 502);

// caché en memoria: malId → { data, expiresAt }
const detailCache = new Map();
const CACHE_TTL   = 6 * 60 * 60 * 1000; // 6 horas

const DAY_MAP = {
  mondays:    "lunes",
  tuesdays:   "martes",
  wednesdays: "miercoles",
  thursdays:  "jueves",
  fridays:    "viernes",
  saturdays:  "sabado",
  sundays:    "domingo",
};

function parseBroadcastTime(timeStr) {
  if (!timeStr) return "00:00";
  const match = timeStr.match(/(\d{2}:\d{2})/);
  return match ? match[1] : "00:00";
}

function mapDay(broadcastDay) {
  if (!broadcastDay) return "lunes";
  return DAY_MAP[broadcastDay.toLowerCase()] || "lunes";
}

// GET /admin/jikan/search?q=
export const searchAnimes = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) return successResponse(res, []);

  try {
    const json = await fetchSearch(q.trim());
    const results = (json.data || []).map((a) => ({
      malId:       a.mal_id,
      title:       a.title,
      titleEs:     a.title_spanish || null,
      imageUrl:    a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || "",
      description: a.synopsis || "",
      score:       a.score,
      episodes:    a.episodes,
      status:      a.status,
      genres:      (a.genres || []).map((g) => g.name),
    }));

    return successResponse(res, results);
  } catch (error) {
    console.error("[jikan] search error:", error.message);
    return jikanFail(res, error, "Error al conectar con Jikan API");
  }
};

// GET /api/anime/:malId/detail  — público, con caché 6h
export const getPublicAnimeDetail = async (req, res) => {
  const malId = Number(req.params.malId);
  if (!malId) return errorResponse(res, "malId inválido", 400);

  const cached = detailCache.get(malId);
  if (cached && cached.expiresAt > Date.now()) {
    return successResponse(res, cached.data);
  }

  try {
    const json = await getAnime(malId);
    const a = json.data;

    const data = {
      malId:     a.mal_id,
      score:     a.score,
      scored_by: a.scored_by,
      episodes:  a.episodes,
      status:    a.status,
      genres:    (a.genres || []).map((g) => g.name),
      studios:   (a.studios || []).map((s) => s.name),
      trailer:   a.trailer?.embed_url || null,
    };

    detailCache.set(malId, { data, expiresAt: Date.now() + CACHE_TTL });
    return successResponse(res, data);
  } catch (error) {
    console.error("[jikan] public detail error:", error.message);
    return jikanFail(res, error, "Error al obtener detalle");
  }
};

// GET /admin/jikan/detail/:malId
export const getAnimeDetail = async (req, res) => {
  const { malId } = req.params;

  try {
    const json = await getAnime(malId);
    const a = json.data;
    const platform = await anilistPlatform(malId).catch(() => null);

    return successResponse(res, {
      platform,
      malId:       a.mal_id,
      title:       a.title_spanish || a.title,
      titleOriginal: a.title,
      imageUrl:    a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || "",
      description: a.synopsis || "",
      score:       a.score,
      episodes:    a.episodes,
      genres:      (a.genres || []).map((g) => g.name),
      broadcastDay:  a.broadcast?.day   || null,
      broadcastTime: a.broadcast?.time  || null,
    });
  } catch (error) {
    console.error("[jikan] detail error:", error.message);
    return jikanFail(res, error, "Error al obtener detalle de Jikan");
  }
};

// POST /admin/jikan/sync  — disparo manual de la sincronización
export const triggerSync = async (req, res) => {
  try {
    const { runSeasonSync } = await import("../../jobs/syncSeason.job.js");
    runSeasonSync(); // fire-and-forget, los logs van a consola
    return successResponse(res, null, "Sincronización iniciada en segundo plano");
  } catch (error) {
    return errorResponse(res, "Error al iniciar sincronización", 500);
  }
};

// POST /admin/jikan/import  — importación masiva por temporada
export const importSeason = async (req, res) => {
  const { year, season, seasonId, defaultTime = "00:00", defaultStatus = "crunchyroll" } = req.body;

  if (!year || !season || !seasonId) {
    return errorResponse(res, "year, season y seasonId son requeridos", 400);
  }

  try {
    let page = 1;
    let hasNext = true;
    // plataforma de cada anime según AniList; si falla o no hay dato, se usa defaultStatus
    let platforms = new Map();
    try {
      platforms = await anilistSeasonPlatforms(year, season);
    } catch (err) {
      console.warn("[jikan] no se pudo detectar plataformas:", err.message);
    }
    let detected = 0;
    let imported = 0;
    let skipped = 0;
    const errors = [];

    while (hasNext) {
      let json;
      try {
        json = await getSeasonPage(year, season, page);
      } catch (err) {
        if (err instanceof JikanError && err.notFound) break;
        throw err;
      }
      const items = json.data || [];
      hasNext = json.pagination?.has_next_page || false;

      for (const a of items) {
        try {
          const malId    = a.mal_id;
          const title    = a.title_spanish || a.title;
          const imageUrl = a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || "";
          const description = a.synopsis || "";
          const platform    = platforms.get(malId);
          if (platform) detected++;
          const dayOfWeek   = mapDay(a.broadcast?.day);
          const time        = parseBroadcastTime(a.broadcast?.time) || defaultTime;

          // upsert anime por mal_id
          const [anime] = await db
            .insert(animes)
            .values({ title, imageUrl, description, status: platform || defaultStatus, malId })
            .onConflictDoUpdate({
              target: animes.malId,
              set: { title, imageUrl, description, ...(platform && { status: platform }) },
            })
            .returning();

          // crear calendar_entry solo si no existe para este anime + temporada
          const [existing] = await db
            .select()
            .from(calendarEntries)
            .where(and(
              eq(calendarEntries.animeId,  anime.id),
              eq(calendarEntries.seasonId, Number(seasonId)),
            ));

          if (!existing) {
            await db.insert(calendarEntries).values({
              animeId:  anime.id,
              seasonId: Number(seasonId),
              dayOfWeek,
              time,
            });
            imported++;
          } else {
            skipped++;
          }
        } catch (itemErr) {
          errors.push({ malId: a.mal_id, title: a.title, error: itemErr.message });
        }
      }

      page++;
    }

    return successResponse(res, { imported, skipped, detected, errors }, `Importación completada: ${imported} nuevos, ${skipped} ya existentes (${detected} con plataforma detectada)`);
  } catch (error) {
    console.error("[jikan] import error:", error.message);
    return errorResponse(res, `Error en importación: ${error.message}`, error instanceof JikanError ? error.status : 502);
  }
};
