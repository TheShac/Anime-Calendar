import { X, Clock } from "lucide-react";
import Modal from "../../../components/ui/modal/Modal";

const PLATFORM_STYLES = {
  crunchyroll: { bg: "rgba(249,115,22,0.15)", color: "#f97316", border: "rgba(249,115,22,0.35)", label: "Crunchyroll" },
  netflix:     { bg: "rgba(239,68,68,0.15)",  color: "#ef4444", border: "rgba(239,68,68,0.35)",  label: "Netflix"     },
  disney:      { bg: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "rgba(59,130,246,0.35)", label: "Disney+"     },
  amazon:      { bg: "rgba(234,179,8,0.15)",  color: "#eab308", border: "rgba(234,179,8,0.35)",  label: "Prime Video" },
  alternativa: { bg: "rgba(113,113,122,0.15)",color: "#a1a1aa", border: "rgba(113,113,122,0.3)", label: "Alternativa" },
};

const getPlatform = (status) =>
  PLATFORM_STYLES[status] ?? {
    bg: "rgba(113,113,122,0.15)",
    color: "#a1a1aa",
    border: "rgba(113,113,122,0.3)",
    label: status,
  };

export default function AnimeModal({ anime, onClose }) {
  const platform = anime ? getPlatform(anime.status) : null;

  return (
    <Modal isOpen={!!anime} onClose={onClose} maxWidth="max-w-2xl">
      {anime && (
        <>
          {/* imagen */}
          <div className="relative">
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

            {/* botón cerrar */}
            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              className="absolute top-4 right-4 flex items-center justify-center rounded-full transition-colors"
              style={{
                width: "38px",
                height: "38px",
                background: "rgba(0,0,0,0.65)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#ffffff",
                backdropFilter: "blur(4px)",
              }}
            >
              <X size={18} />
            </button>

            {/* badge plataforma */}
            {platform && (
              <div
                className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{
                  background: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${platform.border}`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: platform.color }}
                />
                <span
                  className="text-[15px] font-bold tracking-wide"
                  style={{ color: platform.color }}
                >
                  {platform.label}
                </span>
              </div>
            )}

            {/* título sobre imagen */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ padding: "0 28px 24px" }}
            >
              <h2
                className="font-black tracking-tight leading-tight"
                style={{ fontSize: "28px", color: "#ffffff" }}
              >
                {anime.title}
              </h2>
            </div>
          </div>

          {/* contenido */}
          <div style={{ padding: "20px 28px 32px" }}>
            <div
              className="flex items-center gap-2"
              style={{
                marginBottom: "24px",
                paddingBottom: "20px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <Clock size={15} aria-hidden="true" style={{ color: "#10b981" }} />
              <span
                className="font-mono text-sm font-semibold"
                style={{ color: "#10b981" }}
              >
                {anime.time}
              </span>
            </div>

            {anime.description && (
              <div>
                <p
                  className="font-bold uppercase tracking-widest"
                  style={{ fontSize: "11px", color: "#52525b", marginBottom: "12px" }}
                >
                  Sinopsis
                </p>
                <p
                  style={{ fontSize: "15px", lineHeight: "1.75", color: "#a1a1aa" }}
                >
                  {anime.description}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}