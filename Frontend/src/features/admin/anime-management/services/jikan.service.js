import { API_URL } from "../../../../lib/api";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function searchJikan(query) {
  if (!query || query.trim().length < 2) return [];
  const res = await fetch(
    `${API_URL}/admin/jikan/search?q=${encodeURIComponent(query.trim())}`,
    { headers: getHeaders() }
  );
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function getJikanDetail(malId) {
  const res = await fetch(
    `${API_URL}/admin/jikan/detail/${malId}`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error("No se pudo obtener detalle de Jikan");
  const json = await res.json();
  return json.data;
}

export async function importJikanSeason({ year, season, seasonId, defaultStatus }) {
  const res = await fetch(`${API_URL}/admin/jikan/import`, {
    method: "POST",
    headers: { ...getHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ year, season, seasonId, defaultStatus }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error en importación");
  return json.data;
}
