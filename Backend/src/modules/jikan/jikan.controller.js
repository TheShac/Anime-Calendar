import { successResponse, errorResponse } from "../../utils/apiResponse.js";

const JIKAN_BASE = "https://api.jikan.moe/v4";

export const searchAnimes = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return successResponse(res, []);
  }

  try {
    const url = `${JIKAN_BASE}/anime?q=${encodeURIComponent(q.trim())}&limit=8&sfw=true`;
    const response = await fetch(url);

    if (!response.ok) {
      return errorResponse(res, "Error al contactar Jikan API", response.status);
    }

    const json = await response.json();

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
    console.error("[jikan] fetch error:", error);
    return errorResponse(res, "Error al conectar con Jikan API", 502);
  }
};
