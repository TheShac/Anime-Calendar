import cron from "node-cron";
import { db } from "../config/db.js";
import { animes } from "../modules/animes/anime.schema.js";
import { inArray, isNotNull } from "drizzle-orm";

const JIKAN_BASE = "https://api.jikan.moe/v4";

async function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchCurrentlyAiring() {
  const results = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const res = await fetch(`${JIKAN_BASE}/seasons/now?page=${page}`);
    if (!res.ok) break;

    const json = await res.json();
    results.push(...(json.data || []));
    hasNext = json.pagination?.has_next_page || false;

    if (hasNext) await delay(400);
    page++;
  }

  return results;
}

export async function runSeasonSync() {
  console.log("[sync] Iniciando sincronización de temporada actual...");

  try {
    // 1. traer todos los animes de nuestra BD que tienen mal_id
    const localAnimes = await db
      .select({ id: animes.id, malId: animes.malId, title: animes.title, imageUrl: animes.imageUrl })
      .from(animes)
      .where(isNotNull(animes.malId));

    if (!localAnimes.length) {
      console.log("[sync] No hay animes con mal_id en la BD. Nada que sincronizar.");
      return;
    }

    const localByMalId = new Map(localAnimes.map((a) => [a.malId, a]));

    // 2. traer temporada actual de Jikan
    const jikanAnimes = await fetchCurrentlyAiring();
    console.log(`[sync] Jikan devolvió ${jikanAnimes.length} animes en emisión.`);

    // 3. cruzar y actualizar solo los que tenemos
    let updated = 0;
    let unchanged = 0;

    for (const ja of jikanAnimes) {
      const local = localByMalId.get(ja.mal_id);
      if (!local) continue;

      const newTitle    = ja.title_spanish || ja.title;
      const newImageUrl = ja.images?.jpg?.large_image_url || ja.images?.jpg?.image_url || local.imageUrl;

      const titleChanged = newTitle    !== local.title;
      const imageChanged = newImageUrl !== local.imageUrl;

      if (titleChanged || imageChanged) {
        await db
          .update(animes)
          .set({ title: newTitle, imageUrl: newImageUrl })
          .where(inArray(animes.id, [local.id]));

        console.log(`[sync] Actualizado: "${local.title}"${titleChanged ? ` → "${newTitle}"` : ""}${imageChanged ? " (imagen)" : ""}`);
        updated++;
      } else {
        unchanged++;
      }
    }

    console.log(`[sync] Completado: ${updated} actualizados, ${unchanged} sin cambios.`);
  } catch (err) {
    console.error("[sync] Error durante la sincronización:", err.message);
  }
}

// lunes a las 6:00 AM
export function startSyncJob() {
  cron.schedule("0 6 * * 1", runSeasonSync, {
    timezone: "America/Bogota",
  });
  console.log("[sync] Cron registrado: lunes 06:00 AM (America/Bogota)");
}
