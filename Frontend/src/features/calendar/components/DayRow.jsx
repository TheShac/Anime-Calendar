import { MoonStar } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import AnimeCard from "./AnimeCard";

export default function DayRow({ day, animes, onSelectAnime }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="rounded-2xl border"
      style={{
        background: isDark ? "#111111" : "#ffffff",
        borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
        padding: "16px",
      }}
    >
      <h2
        className="font-black capitalize tracking-tight"
        style={{
          fontSize: "clamp(16px, 4vw, 22px)",
          color: "#10b981",
          marginBottom: "14px",
        }}
      >
        {day}
      </h2>

      {animes.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-2 py-8"
          style={{ color: isDark ? "#3f3f46" : "#d4d4d8" }}
        >
          <MoonStar size={22} aria-hidden="true" />
          <span style={{ fontSize: "13px", color: isDark ? "#52525b" : "#a1a1aa" }}>
            Sin estrenos este día
          </span>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "12px",
          }}
        >
          {animes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} onClick={onSelectAnime} />
          ))}
        </div>
      )}
    </div>
  );
}