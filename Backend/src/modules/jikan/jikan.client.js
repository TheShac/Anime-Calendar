// Cliente único para Jikan API v4 (límites públicos: 3 req/s y 60 req/min).
// Base configurable con JIKAN_BASE_URL (mirror, proxy o instancia propia con Docker).
const JIKAN_BASE = (process.env.JIKAN_BASE_URL || "https://api.jikan.moe/v4").replace(/\/$/, "");

const TIMEOUT_MS  = Number(process.env.JIKAN_TIMEOUT_MS || 8000);
const MAX_RETRIES = 2;
const MIN_GAP_MS  = 400; // ~2.5 req/s, por debajo del límite de 3/s

export class JikanError extends Error {
  constructor(message, { status = 502, notFound = false, unreachable = false } = {}) {
    super(message);
    this.name = "JikanError";
    this.status = status;
    this.notFound = notFound;
    this.unreachable = unreachable;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// cola simple: serializa las peticiones y las espacia MIN_GAP_MS
let queue = Promise.resolve();
function throttle() {
  const turn = queue.then(() => sleep(MIN_GAP_MS));
  queue = turn.catch(() => {});
  return turn;
}

// caché de respuestas: fresca (ttl) y "stale" para servir si Jikan no responde
const cache = new Map();
const FRESH_TTL = 10 * 60 * 1000;
const STALE_TTL = 24 * 60 * 60 * 1000;

export async function jikanGet(path, { cacheable = true, retries = MAX_RETRIES, timeoutMs = TIMEOUT_MS } = {}) {
  const url = `${JIKAN_BASE}${path}`;
  const hit = cache.get(url);
  if (cacheable && hit && hit.freshUntil > Date.now()) return hit.json;

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    await throttle();
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });

      if (res.ok) {
        const json = await res.json();
        if (cacheable) {
          cache.set(url, { json, freshUntil: Date.now() + FRESH_TTL, staleUntil: Date.now() + STALE_TTL });
        }
        return json;
      }

      if (res.status === 404) {
        const nf = new JikanError("No encontrado en Jikan", { status: 404, notFound: true });
        nf.fatal = true;
        throw nf;
      }

      // 429 / 5xx son transitorios: reintentar con espera creciente
      if (res.status === 429 || res.status >= 500) {
        const retryAfter = Number(res.headers.get("retry-after")) * 1000;
        lastError = new JikanError(`Jikan respondió ${res.status}`, { status: 502 });
        if (attempt < retries) await sleep(retryAfter || 1000 * 2 ** attempt);
        continue;
      }

      const fatal = new JikanError(`Jikan respondió ${res.status}`, { status: 502 });
      fatal.fatal = true;
      throw fatal;
    } catch (err) {
      if (err instanceof JikanError && err.fatal) throw err;
      // timeout / red caída
      lastError = new JikanError("No se pudo conectar con Jikan API", { status: 503, unreachable: true });
      lastError.cause = err;
      if (attempt < retries) await sleep(1000 * 2 ** attempt);
    }
  }

  // sin conexión: servir lo último que tengamos aunque esté vencido
  if (cacheable && hit && hit.staleUntil > Date.now()) return hit.json;
  throw lastError;
}
