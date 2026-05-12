import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Modal from "../../../../components/ui/modal/Modal";

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

export default function SeasonFormModal({ open, onClose, onSubmit, season, saving }) {
  const [form, setForm] = useState({ name: "", slug: "" });

  useEffect(() => {
    if (season) {
      setForm({ name: season.name || "", slug: season.slug || "" });
    } else {
      setForm({ name: "", slug: "" });
    }
  }, [season, open]);

  // auto-genera slug desde el nombre
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setForm({ name, slug });
  };

  const handleSlugChange = (e) =>
    setForm((prev) => ({ ...prev, slug: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const focusStyle = (e) => e.target.style.borderColor = "#10b981";
  const blurStyle  = (e) => e.target.style.borderColor = "rgba(255,255,255,0.08)";

  return (
    <Modal isOpen={open} onClose={onClose} maxWidth="max-w-md">
      <div style={{ padding: "28px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "24px" }}>
          <h2 className="font-black" style={{ fontSize: "20px", color: "#f0f0f0" }}>
            {season ? "Editar temporada" : "Nueva temporada"}
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
          <div>
            <label style={LABEL_STYLE}>Nombre</label>
            <input
              type="text" placeholder="Ej: Primavera 2026"
              value={form.name} onChange={handleNameChange} required
              style={FIELD_STYLE} onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>

          <div>
            <label style={LABEL_STYLE}>Slug</label>
            <input
              type="text" placeholder="Ej: spring-2026"
              value={form.slug} onChange={handleSlugChange} required
              style={FIELD_STYLE} onFocus={focusStyle} onBlur={blurStyle}
            />
            <p style={{ fontSize: "11px", color: "#52525b", marginTop: "6px" }}>
              Se usa en la URL — se genera automáticamente
            </p>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "4px" }} />

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
              season ? "Guardar cambios" : "Crear temporada"
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
}