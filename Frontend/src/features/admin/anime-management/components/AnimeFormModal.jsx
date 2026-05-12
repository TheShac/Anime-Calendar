import { useEffect, useState } from "react";
import { X, Clock } from "lucide-react";
import Modal from "../../../../components/ui/modal/Modal";
import { DAYS } from "../../../../constants/days";

const FIELD_STYLE = {
  width: "100%",
  background: "#1a1a1a",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  padding: "11px 14px",
  fontSize: "14px",
  color: "#f0f0f0",
  outline: "none",
  fontFamily: "inherit",
};

const LABEL_STYLE = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "#52525b",
  marginBottom: "7px",
};

const STATUS_OPTIONS = [
  { value: "crunchyroll",   label: "Crunchyroll"        },
  { value: "netflix",       label: "Netflix"            },
  { value: "disney",        label: "Disney+"            },
  { value: "amazon",        label: "Amazon Prime Video" },
  { value: "alternativa",   label: "Alternativa"        },
];

export default function AnimeFormModal({ open, onClose, onSubmit, anime, saving }) {
  const [form, setForm] = useState({
    title: "", imageUrl: "", description: "",
    status: "ongoing", dayOfWeek: "lunes", time: "00:00",
  });

  useEffect(() => {
    if (anime) {
      setForm({
        title:       anime.title       || "",
        imageUrl:    anime.imageUrl    || "",
        description: anime.description || "",
        status:      anime.status      || "ongoing",
        dayOfWeek:   anime.dayOfWeek   || "lunes",
        time:        anime.time        || "00:00",
      });
    } else {
      setForm({ title: "", imageUrl: "", description: "", status: "ongoing", dayOfWeek: "lunes", time: "00:00" });
    }
  }, [anime, open]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const focusStyle = (e) => e.target.style.borderColor = "#10b981";
  const blurStyle  = (e) => e.target.style.borderColor = "rgba(255,255,255,0.08)";

  return (
    <Modal isOpen={open} onClose={onClose} maxWidth="max-w-lg">
      <div style={{ padding: "28px" }}>
        {/* header */}
        <div className="flex items-center justify-between" style={{ marginBottom: "24px" }}>
          <h2 className="font-black" style={{ fontSize: "20px", color: "#f0f0f0" }}>
            {anime ? "Editar anime" : "Nuevo anime"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px", width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#71717a", cursor: "pointer",
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* título */}
          <div>
            <label style={LABEL_STYLE}>Título</label>
            <input
              type="text" name="title" placeholder="Ej: Jujutsu Kaisen"
              value={form.title} onChange={handleChange} required
              style={FIELD_STYLE} onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>

          {/* imagen */}
          <div>
            <label style={LABEL_STYLE}>URL de imagen</label>
            <input
              type="text" name="imageUrl" placeholder="https://..."
              value={form.imageUrl} onChange={handleChange} required
              style={FIELD_STYLE} onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>

          {/* descripción */}
          <div>
            <label style={LABEL_STYLE}>Descripción</label>
            <textarea
              name="description" placeholder="Sinopsis del anime..."
              value={form.description} onChange={handleChange} rows={3}
              style={{ ...FIELD_STYLE, resize: "vertical", lineHeight: "1.6" }}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>

          {/* estado */}
          <div>
            <label style={LABEL_STYLE}>Estado</label>
            <select
              name="status" value={form.status} onChange={handleChange}
              style={{ ...FIELD_STYLE, cursor: "pointer" }}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* día y hora — fila */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={LABEL_STYLE}>Día</label>
              <select
                name="dayOfWeek" value={form.dayOfWeek} onChange={handleChange}
                style={{ ...FIELD_STYLE, cursor: "pointer", textTransform: "capitalize" }}
              >
                {DAYS.map((day) => (
                  <option key={day} value={day} style={{ textTransform: "capitalize" }}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={LABEL_STYLE}>
                <span className="flex items-center gap-1">
                  <Clock size={11} aria-hidden="true" />
                  Hora
                </span>
              </label>
              <input
                type="time" name="time" value={form.time} onChange={handleChange}
                style={{ ...FIELD_STYLE, cursor: "pointer" }}
                onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>
          </div>

          {/* divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "4px" }} />

          {/* botón */}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2"
            style={{
              width: "100%", background: saving ? "#059669" : "#10b981",
              color: "#000", fontWeight: 800, fontSize: "14px",
              padding: "12px", borderRadius: "10px",
              border: "none", cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.8 : 1,
            }}
          >
            {saving ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Guardando...
              </>
            ) : (
              anime ? "Guardar cambios" : "Crear anime"
            )}
          </button>

        </form>
      </div>
    </Modal>
  );
}