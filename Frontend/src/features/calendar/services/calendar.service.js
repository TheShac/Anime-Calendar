import { API_URL } from "../../../lib/api";

const CACHE_KEY      = "calendar_cache";
const CACHE_NEXT_KEY = "calendar_next_cache";
const CACHE_TTL      = 5 * 60 * 1000;

function getCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    // invalida caché viejo que no tenga malId
    const firstAnime = Object.values(data?.days || {}).find((arr) => arr.length > 0)?.[0];
    if (firstAnime && !("malId" in firstAnime)) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch { return null; }
}

function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

export function clearCalendarCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_NEXT_KEY);
}

export async function getWeeklyCalendar() {
  const response = await fetch(`${API_URL}/api/calendar`);
  const result   = await response.json();
  if (!response.ok) throw new Error(result.message || "Error loading calendar");
  setCache(CACHE_KEY, result.data);
  return result.data;
}

export async function getNextSeasonCalendar() {
  const response = await fetch(`${API_URL}/api/calendar/next`);
  const result   = await response.json();
  if (!response.ok) throw new Error(result.message || "No hay próxima temporada");
  setCache(CACHE_NEXT_KEY, result.data);
  return result.data;
}

export function getWeeklyCalendarCached()     { return getCache(CACHE_KEY); }
export function getNextCalendarCached()        { return getCache(CACHE_NEXT_KEY); }