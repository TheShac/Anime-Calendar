import { useEffect, useRef, useState } from "react";
import { X, Clock, Search, Loader } from "lucide-react";
import Modal from "../../../../components/ui/modal/Modal";
import { DAYS } from "../../../../constants/days";
import { getSeasons } from "../services/calendar-entry.service";
import { searchJikan } from "../services/jikan.service";

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
  { value: "crunchyroll", label: "Crunchyroll"        },
  { value: "netflix",     label: "Netflix"            },
  { value: "disney",      label: "Disney+"            },
  { value: "amazon",      label: "Amazon Prime Video" },
  { value: "alternativa", label: "Alternativa"        },
];

export default function AnimeFormModal({ open, onClose, onSubmit, anime, saving }) {
  const [form, setForm] = useState({
    title: "", imageUrl: "", description: "",
    status: "crunchyroll", dayOfWeek: "lunes", time: "00:00", seasonId: "",
    malId: null,
  });
  const [seasons, setSeasons] = useState([]);

  // jikan search state
  const [query, setQuery]           = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching]   = useState(false);
  const [showDrop, setShowDrop]     = useState(false);
  const debounceRef = useRef(null);
  const dropRef     = useRef(null);

  useEffect(() => {
    if (!open) return;
    getSeasons().then((data) => {
      setSeasons(data);
      setForm((prev) => ({
        ...prev,
        seasonId: prev.seasonId || data.find((s) => s.isActive)?.id || data[0]?.id || "",
      }));
    }).catch(() => {});
  }, [open]);

  useEffect(() => {
    if (anime) {
      setForm({
        title:       anime.title       || "",
        imageUrl:    anime.imageUrl    || "",
        description: anime.description || "",
        status:      anime.status      || "crunchyroll",
        dayOfWeek:   anime.dayOfWeek   || "lunes",
        time:        anime.time        || "00:00",
        seasonId:    anime.seasonId    || "",
        malId:       anime.malId       ?? null,
      });
      setQuery(anime.title || "");
    } else {
      setForm((prev) => ({
        title: "", imageUrl: "", description: "",
        status: "crunchyroll", dayOfWeek: "lunes", time: "00:00",
        seasonId: prev.seasonId,
        malId: null,
      }));
      setQuery("");
    }
    setSuggestions([]);
    setShowDrop(false);
  }, [anime, open]);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setShowDrop(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleTitleInput = (e) => {
    const value = e.target.value;
    setQuery(value);
    setForm((prev) => ({ ...prev, title: value, malId: null }));

    clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowDrop(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const results = await searchJikan(value);
      setSuggestions(results);
      setShowDrop(results.length > 0);
      setSearching(false);
    }, 400);
  };

  const applyJikanSuggestion = (item) => {
    setForm((prev) => ({
      ...prev,
      title:       item.titleEs || item.title,
      imageUrl:    item.imageUrl,
      description: item.description,
      malId:       item.malId,
    }));
    setQuery(item.titleEs || item.title);
    setSuggestions([]);
    setShowDrop(false);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const focusStyle = (e) => (e.target.style.borderColor = "#10b981");
  const blurStyle  = (e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)");

  return (
    <Modal isOpen={open} onClose={onClose} maxWidth="max-w-lg">
      <div style={{ padding: "28px" }}>
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

          {/* título con búsqueda Jikan */}
          <div ref={dropRef} style={{ position: "relative" }}>
            <label style={LABEL_STYLE}>
              <span className="flex items-center gap-1">
                <Search size={10} aria-hidden="true" />
                Título — busca en MyAnimeList
              </span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                name="title"
                placeholder="Ej: Jujutsu Kaisen"
                value={query}
                onChange={handleTitleInput}
                required
                style={{ ...FIELD_STYLE, paddingRight: "38px" }}
                onFocus={focusStyle}
                onBlur={blurStyle}
                autoComplete="off"
              />
              <span style={{
                position: "absolute", right: "12px", top: "50%",
                transform: "translateY(-50%)", color: "#52525b",
                pointerEvents: "none",
              }}>
                {searching
                  ? <Loader size={14} className="animate-spin" aria-hidden="true" />
                  : <Search size={14} aria-hidden="true" />
                }
              </span>
            </div>

            {/* badge mal_id */}
            {form.malId && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                marginTop: "5px", fontSize: "10px", fontWeight: 600,
                color: "#10b981", background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: "6px", padding: "2px 7px",
              }}>
                MAL ID: {form.malId}
              </span>
            )}

            {/* dropdown sugerencias */}
            {showDrop && (
              <ul style={{
                position: "absolute", zIndex: 50, top: "calc(100% + 4px)", left: 0, right: 0,
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                maxHeight: "280px", overflowY: "auto",
                listStyle: "none", margin: 0, padding: "4px 0",
              }}>
                {suggestions.map((item) => (
                  <li
                    key={item.malId}
                    onMouseDown={() => applyJikanSuggestion(item)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "8px 12px", cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt=""
                        aria-hidden="true"
                        style={{ width: "32px", height: "44px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }}
                      />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "13px", color: "#f0f0f0", fontWeight: 600, margin: 0,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.titleEs || item.title}
                      </p>
                      {item.titleEs && (
                        <p style={{ fontSize: "11px", color: "#71717a", margin: "1px 0 0",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.title}
                        </p>
                      )}
                      <p style={{ fontSize: "10px", color: "#52525b", margin: "2px 0 0" }}>
                        {item.episodes ? `${item.episodes} eps` : "? eps"}
                        {item.score ? ` · ★ ${item.score}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
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

          {/* plataforma */}
          <div>
            <label style={LABEL_STYLE}>Plataforma</label>
            <select
              name="status" value={form.status} onChange={handleChange}
              style={{ ...FIELD_STYLE, cursor: "pointer" }}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* temporada */}
          <div>
            <label style={LABEL_STYLE}>Temporada</label>
            <select
              name="seasonId" value={form.seasonId} onChange={handleChange}
              style={{ ...FIELD_STYLE, cursor: "pointer" }}
              required
            >
              {seasons.length === 0 && (
                <option value="">Cargando temporadas...</option>
              )}
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.isActive ? " (activa)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* día y hora */}
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" className="animate-spin" aria-hidden="true">
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
