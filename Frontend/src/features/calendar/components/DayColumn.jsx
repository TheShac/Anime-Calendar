import { MoonStar } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import AnimeCard from "./AnimeCard";

export default function DayColumn({ day, animes, onSelectAnime }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="rounded-2xl border"
      style={{
        background: isDark ? "#111111" : "#ffffff",
        borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
        padding: "12px 10px 16px",
      }}
    >
      <h2
        className="font-bold uppercase tracking-wider mb-3 text-center capitalize"
        style={{ fontSize: "18px", color: "#10b981" }}
      >
        {day}
      </h2>

      <div className="flex flex-col gap-3">
        {animes.length === 0 ? (
          <div
            className="flex flex-col items-center gap-1.5 py-6 text-center"
            style={{ color: isDark ? "#3f3f46" : "#d4d4d8" }}
          >
            <MoonStar size={20} aria-hidden="true" />
            <span style={{ fontSize: "11px", color: isDark ? "#52525b" : "#a1a1aa" }}>
              Sin estrenos
            </span>
          </div>
        ) : (
          animes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} onClick={onSelectAnime} />
          ))
        )}
      </div>
    </div>
  );
}