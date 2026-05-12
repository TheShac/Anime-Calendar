import { Sun, Moon, LayoutDashboard } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuthStore } from "../../../store/authStore";

export default function Header({ title, seasonName }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const token  = useAuthStore((state) => state.token);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{
        background: isDark ? "rgba(10,10,10,0.88)" : "rgba(240,242,245,0.90)",
        borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="w-full flex items-center justify-between"
        style={{ padding: "0 5%", height: "70px" }}
      >
        {/* logo + título */}
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl border-2 flex items-center justify-center font-mono font-black flex-shrink-0"
            style={{
              width: "40px", height: "40px",
              fontSize: "18px",
              borderColor: "#10b981", color: "#10b981",
            }}
          >
            ア
          </div>
          <div>
            <h1
              className="font-black tracking-tight flex flex-wrap items-center gap-2"
              style={{ fontSize: "clamp(14px, 3vw, 24px)", color: isDark ? "#f0f0f0" : "#111111" }}
            >
              {title}
              {seasonName && (
                <span
                  className="hidden sm:inline-flex items-center gap-1 font-bold uppercase rounded-lg"
                  style={{
                    fontSize: "10px", letterSpacing: "0.07em",
                    background: "rgba(16,185,129,0.12)", color: "#10b981",
                    border: "1px solid rgba(16,185,129,0.28)", padding: "3px 8px",
                  }}
                >
                  {seasonName}
                </span>
              )}
            </h1>
            <p
              className="hidden sm:block"
              style={{ fontSize: "12px", marginTop: "2px", color: isDark ? "#71717a" : "#6b7280" }}
            >
              Calendario semanal de estrenos
            </p>
          </div>
        </div>

        {/* acciones */}
        <div className="flex items-center gap-2">
          {token && (
            <a
              href="/admin"
              className="flex items-center gap-1.5 rounded-xl transition-colors font-semibold"
              style={{
                padding: "7px 12px", fontSize: "12px",
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.25)",
                color: "#10b981", textDecoration: "none",
              }}
            >
              <LayoutDashboard size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Admin</span>
            </a>
          )}
          <button
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="rounded-xl transition-colors flex items-center justify-center"
            style={{
              width: "38px", height: "38px",
              background: isDark ? "#1a1a1a" : "#ffffff",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              color: isDark ? "#a1a1aa" : "#6b7280",
            }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}