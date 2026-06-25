import { useEffect, useState } from "react";
import { X, Clock, Star, Tv, Play } from "lucide-react";
import Modal from "../../../components/ui/modal/Modal";
import { API_URL } from "../../../lib/api";

const PLATFORM_STYLES = {
  crunchyroll: { bg: "rgba(249,115,22,0.15)", color: "#f97316", border: "rgba(249,115,22,0.35)", label: "Crunchyroll" },
  netflix:     { bg: "rgba(239,68,68,0.15)",  color: "#ef4444", border: "rgba(239,68,68,0.35)",  label: "Netflix"     },
  disney:      { bg: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "rgba(59,130,246,0.35)", label: "Disney+"     },
  amazon:      { bg: "rgba(234,179,8,0.15)",  color: "#eab308", border: "rgba(234,179,8,0.35)",  label: "Prime Video" },
  alternativa: { bg: "rgba(113,113,122,0.15)",color: "#a1a1aa", border: "rgba(113,113,122,0.3)", label: "Alternativa" },
};

const getPlatform = (status) =>
  PLATFORM_STYLES[status] ?? {
    bg: "rgba(113,113,122,0.15)", color: "#a1a1aa",
    border: "rgba(113,113,122,0.3)", label: status,
  };

async function fetchDetail(malId) {
  const res = await fetch(`${API_URL}/api/anime/${malId}/detail`);
  if (!res.ok) return null;
  const json = await res.json();
  return json.data || null;
}

export default function AnimeModal({ anime, onClose }) {
  const [detail, setDetail]   = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!anime?.malId) { setDetail(null); return; }
    setDetail(null);
    setShowTrailer(false);
    fetchDetail(anime.malId).then(setDetail).catch(() => setDetail(null));
  }, [anime?.malId]);

  useEffect(() => {
    if (!anime) setShowTrailer(false);
  }, [anime]);

  const platform = anime ? getPlatform(anime.status) : null;

  return (
    <Modal isOpen={!!anime} onClose={onClose} maxWidth="max-w-2xl">
      {anime && (
        <>
          {/* imagen / trailer */}
          <div className="relative">
            {showTrailer && detail?.trailer ? (
              <iframe
                src={detail.trailer}
                title={`Trailer de ${anime.title}`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ width: "100%", height: "400px", border: "none", display: "block", background: "#000" }}
              />
            ) : (
              <>
                <img
                  src={anime.imageUrl}
                  alt={anime.title}
                  className="w-full object-cover block"
                  style={{ height: "400px" }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(to top, #111111 5%, rgba(0,0,0,0.3) 60%, transparent 100%)",
                  }}
                />

                {/* botón trailer */}
                {detail?.trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="absolute flex items-center gap-2"
                    style={{
                      bottom: "80px", left: "50%", transform: "translateX(-50%)",
                      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "#fff", fontWeight: 700, fontSize: "13px",
                      padding: "8px 18px", borderRadius: "20px", cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Play size={14} fill="white" aria-hidden="true" />
                    Ver trailer
                  </button>
                )}
              </>
            )}

            {/* botón cerrar */}
            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              className="absolute top-4 right-4 flex items-center justify-center rounded-full transition-colors"
              style={{
                width: "38px", height: "38px",
                background: "rgba(0,0,0,0.65)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#ffffff", backdropFilter: "blur(4px)", zIndex: 10,
              }}
            >
              <X size={18} />
            </button>

            {/* badge plataforma */}
            {platform && !showTrailer && (
              <div
                className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{
                  background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
                  border: `1px solid ${platform.border}`,
                }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: platform.color }} />
                <span className="text-[15px] font-bold tracking-wide" style={{ color: platform.color }}>
                  {platform.label}
                </span>
              </div>
            )}

            {/* título sobre imagen */}
            {!showTrailer && (
              <div className="absolute bottom-0 left-0 right-0" style={{ padding: "0 28px 24px" }}>
                <h2 className="font-black tracking-tight leading-tight" style={{ fontSize: "28px", color: "#ffffff" }}>
                  {anime.title}
                </h2>
              </div>
            )}
          </div>

          {/* contenido */}
          <div style={{ padding: "20px 28px 32px" }}>

            {/* fila: hora + stats de MAL */}
            <div
              className="flex items-center gap-4 flex-wrap"
              style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2">
                <Clock size={15} aria-hidden="true" style={{ color: "#10b981" }} />
                <span className="font-mono text-sm font-semibold" style={{ color: "#10b981" }}>
                  {anime.time}
                </span>
              </div>

              {detail?.score && (
                <div className="flex items-center gap-1.5">
                  <Star size={14} fill="#fbbf24" color="#fbbf24" aria-hidden="true" />
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#fbbf24" }}>
                    {detail.score.toFixed(1)}
                  </span>
                  {detail.scored_by && (
                    <span style={{ fontSize: "11px", color: "#52525b" }}>
                      ({(detail.scored_by / 1000).toFixed(0)}k votos)
                    </span>
                  )}
                </div>
              )}

              {detail?.episodes && (
                <div className="flex items-center gap-1.5">
                  <Tv size={14} aria-hidden="true" style={{ color: "#71717a" }} />
                  <span style={{ fontSize: "13px", color: "#71717a", fontWeight: 600 }}>
                    {detail.episodes} ep.
                  </span>
                </div>
              )}

              {!detail && anime.malId && (
                <span style={{ fontSize: "12px", color: "#3f3f46" }}>Cargando datos MAL…</span>
              )}
            </div>

            {/* géneros */}
            {detail?.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2" style={{ marginBottom: "20px" }}>
                {detail.genres.map((g) => (
                  <span
                    key={g}
                    style={{
                      fontSize: "11px", fontWeight: 600, color: "#a78bfa",
                      background: "rgba(139,92,246,0.1)",
                      border: "1px solid rgba(139,92,246,0.2)",
                      padding: "3px 10px", borderRadius: "20px",
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* sinopsis */}
            {anime.description && (
              <div>
                <p
                  className="font-bold uppercase tracking-widest"
                  style={{ fontSize: "11px", color: "#52525b", marginBottom: "12px" }}
                >
                  Sinopsis
                </p>
                <p style={{ fontSize: "15px", lineHeight: "1.75", color: "#a1a1aa" }}>
                  {anime.description}
                </p>
              </div>
            )}

            {/* estudio */}
            {detail?.studios?.length > 0 && (
              <p style={{ fontSize: "12px", color: "#3f3f46", marginTop: "16px" }}>
                Estudio: {detail.studios.join(", ")}
              </p>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
