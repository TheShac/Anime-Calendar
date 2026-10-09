// Fuente de datos de animes: Jikan (MyAnimeList) primero, AniList como respaldo.
// Ambas devuelven el mismo formato (el de Jikan).
import { jikanGet, JikanError } from "./jikan.client.js";
import { anilistSearch, anilistById, anilistSeason, anilistAiringNow } from "./anilist.client.js";

const FAST = { retries: 0, timeoutMs: 6000 };
const SKIP_JIKAN_MS = 10 * 60 * 1000;
let jikanDownUntil = 0;

async function withFallback(jikanFn, anilistFn) {
  if (Date.now() >= jikanDownUntil) {
    try {
      return await jikanFn();
    } catch (err) {
      // 404 es una respuesta válida; solo caemos al respaldo ante fallos de red/servidor
      if (err instanceof JikanError && err.notFound) throw err;
      jikanDownUntil = Date.now() + SKIP_JIKAN_MS;
      console.warn(`[jikan] no disponible (${err.message}); usando AniList por 10 min`);
    }
  }
  return anilistFn();
}

export const searchAnime = (q) =>
  withFallback(
    () => jikanGet(`/anime?q=${encodeURIComponent(q)}&limit=8&sfw=true`, FAST),
    () => anilistSearch(q),
  );

export const getAnime = (malId) =>
  withFallback(
    () => jikanGet(`/anime/${malId}`, FAST),
    () => anilistById(malId),
  );

export const getSeasonPage = (year, season, page) =>
  withFallback(
    () => jikanGet(`/seasons/${year}/${season}?page=${page}`, { ...FAST, cacheable: false }),
    () => anilistSeason(year, season, page),
  );

export const getAiringPage = (page) =>
  withFallback(
    () => jikanGet(`/seasons/now?page=${page}`, { ...FAST, cacheable: false }),
    () => anilistAiringNow(page),
  );
