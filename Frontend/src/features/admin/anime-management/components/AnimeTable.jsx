import { Pencil, Trash2, Clock, Check } from "lucide-react";
import { useState } from "react";

const PLATFORM_STYLES = {
  crunchyroll: { bg: "rgba(249,115,22,0.12)",  color: "#f97316", label: "Crunchyroll"  },
  netflix:     { bg: "rgba(220,38,38,0.12)",   color: "#ef4444", label: "Netflix"      },
  disney:      { bg: "rgba(29,78,216,0.12)",   color: "#3b82f6", label: "Disney+"      },
  amazon:      { bg: "rgba(234,179,8,0.12)",   color: "#eab308", label: "Prime Video"  },
  alternativa: { bg: "rgba(113,113,122,0.12)", color: "#71717a", label: "Alternativa"  },
};

const getPlatform = (status) =>
  PLATFORM_STYLES[status] ?? { bg: "rgba(113,113,122,0.12)", color: "#71717a", label: status };

function CustomCheckbox({ checked, onChange, indeterminate, label }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-label={label}
      style={{
        width: "18px", height: "18px",
        borderRadius: "5px",
        border: checked || indeterminate
          ? "2px solid #10b981"
          : "2px solid rgba(255,255,255,0.15)",
        background: checked || indeterminate
          ? "#10b981"
          : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0,
        transition: "all 0.15s",
        padding: 0,
      }}
    >
      {indeterminate && !checked ? (
        <span style={{ width: "8px", height: "2px", background: "#000", borderRadius: "2px", display: "block" }} />
      ) : checked ? (
        <Check size={11} color="#000" strokeWidth={3} aria-hidden="true" />
      ) : null}
    </button>
  );
}

// Vista Desktop - Tabla
function DesktopView({ animes, onEdit, onDelete, selectedIds, onToggleSelect, onToggleSelectAll }) {
  const allSelected  = selectedIds.size === animes.length && animes.length > 0;
  const someSelected = selectedIds.size > 0 && selectedIds.size < animes.length;

  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px", overflow: "hidden",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <th style={{ padding: "14px 16px 14px 20px", width: "40px" }}>
              <CustomCheckbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={onToggleSelectAll}
                label="Seleccionar todos"
              />
            </th>
            {["Imagen", "Título", "Plataforma", "Día", "Hora", "Acciones"].map((h) => (
              <th key={h} style={{
                padding: "14px 20px", textAlign: "left",
                fontSize: "11px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em", color: "#52525b",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {animes.map((anime, i) => {
            const platform   = getPlatform(anime.status);
            const isSelected = selectedIds.has(anime.id);
            return (
              <tr
                key={anime.id}
                style={{
                  borderBottom: i < animes.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  background: isSelected ? "rgba(16,185,129,0.05)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? "rgba(16,185,129,0.05)" : "transparent"; }}
              >
                <td style={{ padding: "14px 16px 14px 20px" }}>
                  <CustomCheckbox
                    checked={isSelected}
                    onChange={() => onToggleSelect(anime.id)}
                    label={`Seleccionar ${anime.title}`}
                  />
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <img
                    src={anime.imageUrl} alt={anime.title}
                    style={{ width: "48px", height: "66px", objectFit: "cover", borderRadius: "8px" }}
                  />
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#f0f0f0" }}>{anime.title}</p>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.05em", padding: "4px 10px", borderRadius: "20px",
                    background: platform.bg, color: platform.color, display: "inline-block",
                  }}>
                    {platform.label}
                  </span>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  {anime.dayOfWeek
                    ? <span style={{ fontSize: "13px", color: "#a1a1aa", textTransform: "capitalize" }}>{anime.dayOfWeek}</span>
                    : <span style={{ fontSize: "13px", color: "#3f3f46" }}>—</span>
                  }
                </td>
                <td style={{ padding: "14px 20px" }}>
                  {anime.time
                    ? <span className="flex items-center gap-1.5" style={{ fontSize: "13px", color: "#a1a1aa", fontFamily: "monospace" }}>
                        <Clock size={12} aria-hidden="true" style={{ color: "#10b981" }} />{anime.time}
                      </span>
                    : <span style={{ fontSize: "13px", color: "#3f3f46" }}>—</span>
                  }
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => onEdit(anime)}
                      className="flex items-center gap-1.5"
                      style={{
                        padding: "7px 14px", borderRadius: "8px",
                        background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)",
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
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
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

// Vista Mobile - Tarjetas
function MobileView({ animes, onEdit, onDelete, selectedIds, onToggleSelect, onToggleSelectAll }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {animes.map((anime) => {
        const platform = getPlatform(anime.status);
        const isSelected = selectedIds.has(anime.id);
        return (
          <div
            key={anime.id}
            style={{
              background: isSelected ? "rgba(16,185,129,0.1)" : "#111111",
              border: isSelected ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.07)",
              borderRadius: "12px", padding: "16px",
              transition: "all 0.15s",
            }}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <CustomCheckbox
                checked={isSelected}
                onChange={() => onToggleSelect(anime.id)}
                label={`Seleccionar ${anime.title}`}
              />
              <img
                src={anime.imageUrl} alt={anime.title}
                style={{ width: "56px", height: "78px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#f0f0f0", marginBottom: "4px", wordBreak: "break-word" }}>{anime.title}</p>
                <span style={{
                  fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.05em", padding: "3px 8px", borderRadius: "16px",
                  background: platform.bg, color: platform.color, display: "inline-block", marginBottom: "8px",
                }}>
                  {platform.label}
                </span>
                <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#a1a1aa" }}>
                  {anime.dayOfWeek && <span style={{ textTransform: "capitalize" }}>{anime.dayOfWeek}</span>}
                  {anime.time && <span style={{ fontFamily: "monospace" }}>{anime.time}</span>}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button
                onClick={() => onEdit(anime)}
                className="flex items-center justify-center gap-1"
                style={{
                  flex: 1, padding: "8px 12px", borderRadius: "8px",
                  background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)",
                  color: "#60a5fa", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                }}
              >
                <Pencil size={14} aria-hidden="true" />
                Editar
              </button>
              <button
                onClick={() => onDelete(anime)}
                className="flex items-center justify-center gap-1"
                style={{
                  flex: 1, padding: "8px 12px", borderRadius: "8px",
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                }}
              >
                <Trash2 size={14} aria-hidden="true" />
                Eliminar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AnimeTable({ animes, onEdit, onDelete, selectedIds, onToggleSelect, onToggleSelectAll }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useState(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? (
    <MobileView animes={animes} onEdit={onEdit} onDelete={onDelete} selectedIds={selectedIds} onToggleSelect={onToggleSelect} onToggleSelectAll={onToggleSelectAll} />
  ) : (
    <DesktopView animes={animes} onEdit={onEdit} onDelete={onDelete} selectedIds={selectedIds} onToggleSelect={onToggleSelect} onToggleSelectAll={onToggleSelectAll} />
  );
}