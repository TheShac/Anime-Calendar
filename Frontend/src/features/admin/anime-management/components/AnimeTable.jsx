import { Pencil, Trash2, Clock } from "lucide-react";

const PLATFORM_STYLES = {
  crunchyroll: { bg: "rgba(249,115,22,0.12)",  color: "#f97316", label: "Crunchyroll"        },
  netflix:     { bg: "rgba(220,38,38,0.12)",   color: "#ef4444", label: "Netflix"            },
  disney:      { bg: "rgba(29,78,216,0.12)",   color: "#3b82f6", label: "Disney+"            },
  amazon:      { bg: "rgba(234,179,8,0.12)",   color: "#eab308", label: "Prime Video"        },
  alternativa: { bg: "rgba(113,113,122,0.12)", color: "#71717a", label: "Alternativa"        },
};

const getPlatform = (status) =>
  PLATFORM_STYLES[status] ?? { bg: "rgba(113,113,122,0.12)", color: "#71717a", label: status };

export default function AnimeTable({ animes, onEdit, onDelete }) {
  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {["Imagen", "Título", "Plataforma", "Día", "Hora", "Acciones"].map((h) => (
              <th key={h} style={{
                padding: "14px 20px", textAlign: "left",
                fontSize: "11px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: "#52525b",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {animes.map((anime, i) => {
            const platform = getPlatform(anime.status);
            return (
              <tr
                key={anime.id}
                style={{
                  borderBottom: i < animes.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={(e)  => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "14px 20px" }}>
                  <img
                    src={anime.imageUrl} alt={anime.title}
                    style={{ width: "48px", height: "66px", objectFit: "cover", borderRadius: "8px" }}
                  />
                </td>

                <td style={{ padding: "14px 20px" }}>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#f0f0f0" }}>
                    {anime.title}
                  </p>
                </td>

                <td style={{ padding: "14px 20px" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                    padding: "4px 10px", borderRadius: "20px",
                    background: platform.bg, color: platform.color,
                    display: "inline-block",
                  }}>
                    {platform.label}
                  </span>
                </td>

                <td style={{ padding: "14px 20px" }}>
                  {anime.dayOfWeek ? (
                    <span style={{ fontSize: "13px", color: "#a1a1aa", textTransform: "capitalize" }}>
                      {anime.dayOfWeek}
                    </span>
                  ) : (
                    <span style={{ fontSize: "13px", color: "#3f3f46" }}>—</span>
                  )}
                </td>

                <td style={{ padding: "14px 20px" }}>
                  {anime.time ? (
                    <span className="flex items-center gap-1.5" style={{ fontSize: "13px", color: "#a1a1aa", fontFamily: "monospace" }}>
                      <Clock size={12} aria-hidden="true" style={{ color: "#10b981" }} />
                      {anime.time}
                    </span>
                  ) : (
                    <span style={{ fontSize: "13px", color: "#3f3f46" }}>—</span>
                  )}
                </td>

                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => onEdit(anime)}
                      className="flex items-center gap-1.5"
                      style={{
                        padding: "7px 14px", borderRadius: "8px",
                        background: "rgba(59,130,246,0.12)",
                        border: "1px solid rgba(59,130,246,0.2)",
                        color: "#60a5fa", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      <Pencil size={13} aria-hidden="true" /> Editar
                    </button>
                    <button
                      onClick={() => onDelete(anime)}
                      className="flex items-center gap-1.5"
                      style={{
                        padding: "7px 14px", borderRadius: "8px",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "#f87171", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      <Trash2 size={13} aria-hidden="true" /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}