// Respaldo cuando Jikan no responde: AniList (GraphQL). Se mapea al mismo formato
// que devuelve Jikan para que el resto del código no cambie. idMal = id de MyAnimeList.
import { JikanError } from "./jikan.client.js";

const ANILIST_URL = "https://graphql.anilist.co";
const TIMEOUT_MS = 12000;

const MEDIA_FIELDS = `
  idMal
  title { romaji english }
  description(asHtml: false)
  coverImage { extraLarge large }
  averageScore
  episodes
  status
  genres
  studios(isMain: true) { nodes { name } }
  trailer { id site }
  airingSchedule(perPage: 1) { nodes { airingAt } }
`;

const DAYS = ["sundays", "mondays", "tuesdays", "wednesdays", "thursdays", "fridays", "saturdays"];
const STATUS = {
  FINISHED: "Finished Airing",
  RELEASING: "Currently Airing",
  NOT_YET_RELEASED: "Not yet aired",
  CANCELLED: "Cancelled",
  HIATUS: "On Hiatus",
};

let lastCall = 0;
async function anilistQuery(query, variables) {
  // AniList permite ~90 req/min: espaciamos las llamadas
  const wait = lastCall + 700 - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();

  let res;
  try {
    res = await fetch(ANILIST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    const e = new JikanError("No se pudo conectar con AniList", { status: 503, unreachable: true });
    e.cause = err;
    throw e;
  }

  if (res.status === 404) throw new JikanError("No encontrado", { status: 404, notFound: true });
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 5000));
    return anilistQuery(query, variables);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.errors) {
    if (json?.errors?.some((e) => e.status === 404)) throw new JikanError("No encontrado", { status: 404, notFound: true });
    throw new JikanError(`AniList respondió ${res.status}`, { status: 502 });
  }
  return json.data;
}

const cleanText = (t) =>
  (t || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

// airingAt (unix) → día y hora en JST, igual que el "broadcast" de Jikan
function toBroadcast(media) {
  const at = media.airingSchedule?.nodes?.[0]?.airingAt;
  if (!at) return { day: null, time: null };
  const jst = new Date(at * 1000 + 9 * 3600 * 1000);
  const hh = String(jst.getUTCHours()).padStart(2, "0");
  const mm = String(jst.getUTCMinutes()).padStart(2, "0");
  return { day: DAYS[jst.getUTCDay()], time: `${hh}:${mm}` };
}

function trailerUrl(t) {
  if (!t?.id) return null;
  if (t.site === "youtube") return `https://www.youtube.com/embed/${t.id}`;
  if (t.site === "dailymotion") return `https://www.dailymotion.com/embed/video/${t.id}`;
  return null;
}

// Media de AniList → objeto con la forma de Jikan
function toJikan(m) {
  const img = m.coverImage?.extraLarge || m.coverImage?.large || "";
  return {
    mal_id: m.idMal,
    title: m.title?.romaji || m.title?.english || "",
    title_spanish: null,
    synopsis: cleanText(m.description),
    images: { jpg: { large_image_url: img, image_url: img } },
    score: m.averageScore ? m.averageScore / 10 : null,
    scored_by: null,
    episodes: m.episodes ?? null,
    status: STATUS[m.status] || m.status,
    genres: (m.genres || []).map((name) => ({ name })),
    studios: (m.studios?.nodes || []).map((s) => ({ name: s.name })),
    trailer: { embed_url: trailerUrl(m.trailer) },
    broadcast: toBroadcast(m),
  };
}

const withMalId = (list) => list.filter((m) => m.idMal).map(toJikan);

export async function anilistSearch(q) {
  const data = await anilistQuery(
    `query ($q: String) { Page(perPage: 8) { media(search: $q, type: ANIME, sort: SEARCH_MATCH, isAdult: false) { ${MEDIA_FIELDS} } } }`,
    { q },
  );
  return { data: withMalId(data.Page.media) };
}

export async function anilistById(malId) {
  const data = await anilistQuery(
    `query ($id: Int) { Media(idMal: $id, type: ANIME) { ${MEDIA_FIELDS} } }`,
    { id: Number(malId) },
  );
  return { data: toJikan(data.Media) };
}

export function anilistSeason(year, season, page = 1) {
  const f = "season: $season, seasonYear: $year, format_in: [TV, TV_SHORT, ONA]";
  return listPageWith(f, { season: String(season).toUpperCase(), year: Number(year) }, page);
}

export function anilistAiringNow(page = 1) {
  return listPageWith("status: RELEASING", {}, page);
}

async function listPageWith(filterStr, vars, page) {
  const data = await anilistQuery(
    `query ($page: Int${vars.season ? ", $season: MediaSeason, $year: Int" : ""}) {
      Page(page: $page, perPage: 50) {
        pageInfo { hasNextPage }
        media(${filterStr}, type: ANIME, isAdult: false, sort: POPULARITY_DESC) { ${MEDIA_FIELDS} }
      }
    }`,
    { page, ...vars },
  );
  return {
    data: withMalId(data.Page.media),
    pagination: { has_next_page: data.Page.pageInfo.hasNextPage },
  };
}

// ── Plataforma de streaming ────────────────────────────────────────────────
// Devuelve el valor que usa la web (crunchyroll | netflix | disney | amazon) o null.
// Si hay varias, gana la primera de esta lista.
const PLATFORM_PRIORITY = [
  ["crunchyroll", /crunchyroll/i],
  ["netflix",     /netflix/i],
  ["disney",      /disney/i],
  ["amazon",      /amazon|prime/i],
];

export function detectPlatform(externalLinks = []) {
  const sites = externalLinks.filter((l) => l.type === "STREAMING").map((l) => l.site);
  for (const [value, re] of PLATFORM_PRIORITY) {
    if (sites.some((s) => re.test(s))) return value;
  }
  return null;
}

// Map(malId → plataforma) de toda una temporada
export async function anilistSeasonPlatforms(year, season) {
  const map = new Map();
  let page = 1;
  let hasNext = true;
  while (hasNext) {
    const data = await anilistQuery(
      `query ($page: Int, $season: MediaSeason, $year: Int) {
        Page(page: $page, perPage: 50) {
          pageInfo { hasNextPage }
          media(season: $season, seasonYear: $year, format_in: [TV, TV_SHORT, ONA], type: ANIME, isAdult: false) {
            idMal
            externalLinks { site type }
          }
        }
      }`,
      { page, season: String(season).toUpperCase(), year: Number(year) },
    );
    for (const m of data.Page.media) {
      const p = m.idMal && detectPlatform(m.externalLinks);
      if (p) map.set(m.idMal, p);
    }
    hasNext = data.Page.pageInfo.hasNextPage;
    page++;
  }
  return map;
}

export async function anilistPlatform(malId) {
  const data = await anilistQuery(
    `query ($id: Int) { Media(idMal: $id, type: ANIME) { externalLinks { site type } } }`,
    { id: Number(malId) },
  );
  return detectPlatform(data.Media.externalLinks);
}
