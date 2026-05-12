import { API_URL } from "../../../lib/api";

const CACHE_KEY = "calendar_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

export function clearCalendarCache() {
  localStorage.removeItem(CACHE_KEY);
}

export async function getWeeklyCalendar() {
  const response = await fetch(`${API_URL}/api/calendar`);
  const result   = await response.json();
  if (!response.ok) throw new Error(result.message || "Error loading calendar");
  setCache(result.data);
  return result.data;
}

export async function getWeeklyCalendarCached() {
  return getCache();
}