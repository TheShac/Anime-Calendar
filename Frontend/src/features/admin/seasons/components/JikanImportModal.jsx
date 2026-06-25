import { useState } from "react";
import { X, Download, CheckCircle, AlertCircle } from "lucide-react";
import Modal from "../../../../components/ui/modal/Modal";
import { importJikanSeason } from "../../anime-management/services/jikan.service";

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
  cursor: "pointer",
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

const JIKAN_SEASONS = [
  { value: "winter", label: "Invierno (Enero–Marzo)" },
  { value: "spring", label: "Primavera (Abril–Junio)" },
  { value: "summer", label: "Verano (Julio–Septiembre)" },
  { value: "fall",   label: "Otoño (Octubre–Diciembre)" },
];

const STATUS_OPTIONS = [
  { value: "crunchyroll", label: "Crunchyroll"        },
  { value: "netflix",     label: "Netflix"            },
  { value: "disney",      label: "Disney+"            },
  { value: "amazon",      label: "Amazon Prime Video" },
  { value: "alternativa", label: "Alternativa"        },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear + 1 - i);

export default function JikanImportModal({ open, onClose, seasons }) {
  const [form, setForm] = useState({
    year:          String(currentYear),
    season:        "spring",
    seasonId:      "",
    defaultStatus: "crunchyroll",
  });
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImport = async (e) => {
    e.preventDefault();
    if (!form.seasonId) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await importJikanSeason({
        year:          Number(form.year),
        season:        form.season,
        seasonId:      Number(form.seasonId),
        defaultStatus: form.defaultStatus,
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose} maxWidth="max-w-md">
      <div style={{ padding: "28px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
          <div>
            <h2 className="font-black" style={{ fontSize: "18px", color: "#f0f0f0", margin: 0 }}>
              Importar temporada desde Jikan
            </h2>
            <p style={{ fontSize: "12px", color: "#52525b", marginTop: "4px" }}>
              Los animes se crean o actualizan por MAL ID
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px", width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#71717a", cursor: "pointer", flexShrink: 0,
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* resultado */}
        {result && (
          <div style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "12px", padding: "16px", marginBottom: "20px",
          }}>
            <div className="flex items-center gap-2" style={{ marginBottom: "8px" }}>
              <CheckCircle size={16} color="#10b981" aria-hidden="true" />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#10b981" }}>
                Importación completada
              </span>
            </div>
            <div style={{ fontSize: "13px", color: "#d1fae5", display: "flex", gap: "16px" }}>
              <span>✓ {result.imported} nuevos</span>
              <span>↺ {result.skipped} ya existían</span>
              {result.errors?.length > 0 && (
                <span style={{ color: "#fca5a5" }}>✗ {result.errors.length} errores</span>
              )}
            </div>
          </div>
        )}

        {/* error */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "12px", padding: "16px", marginBottom: "20px",
          }}>
            <div className="flex items-center gap-2">
              <AlertCircle size={16} color="#f87171" aria-hidden="true" />
              <span style={{ fontSize: "13px", color: "#f87171" }}>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleImport} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={LABEL_STYLE}>Año</label>
              <select name="year" value={form.year} onChange={handleChange} style={FIELD_STYLE}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={LABEL_STYLE}>Temporada Jikan</label>
              <select name="season" value={form.season} onChange={handleChange} style={FIELD_STYLE}>
                {JIKAN_SEASONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={LABEL_STYLE}>Guardar en temporada</label>
            <select name="seasonId" value={form.seasonId} onChange={handleChange} style={FIELD_STYLE} required>
              <option value="">Selecciona una temporada...</option>
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.isActive ? " (activa)" : s.isNext ? " (próxima)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={LABEL_STYLE}>Plataforma por defecto</label>
            <select name="defaultStatus" value={form.defaultStatus} onChange={handleChange} style={FIELD_STYLE}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div style={{
            background: "rgba(251,191,36,0.07)",
            border: "1px solid rgba(251,191,36,0.15)",
            borderRadius: "8px", padding: "10px 14px",
            fontSize: "11px", color: "#fbbf24", lineHeight: "1.6",
          }}>
            La sinopsis se importa en inglés. Puedes editarla individualmente desde el gestor de animes.
            El día de emisión se asigna automáticamente según Jikan.
          </div>

          <button
            type="submit"
            disabled={loading || !form.seasonId}
            className="flex items-center justify-center gap-2"
            style={{
              width: "100%",
              background: loading || !form.seasonId ? "#1f2937" : "#6366f1",
              color: loading || !form.seasonId ? "#52525b" : "#fff",
              fontWeight: 800, fontSize: "14px",
              padding: "12px", borderRadius: "10px",
              border: "none",
              cursor: loading || !form.seasonId ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" className="animate-spin" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Importando...
              </>
            ) : (
              <>
                <Download size={15} aria-hidden="true" />
                Importar temporada
              </>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
}
