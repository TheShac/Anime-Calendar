import { API_URL } from "../../../../lib/api";

export async function searchJikan(query) {
  if (!query || query.trim().length < 2) return [];

  const token = localStorage.getItem("token");

  console.log("[jikan] search →", `${API_URL}/admin/jikan/search?q=${encodeURIComponent(query.trim())}`);
  const res = await fetch(
    `${API_URL}/admin/jikan/search?q=${encodeURIComponent(query.trim())}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) return [];

  const json = await res.json();
  return json.data || [];
}
