import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const PLATFORM_STYLES = {
  crunchyroll: { bg: "rgba(249,115,22,0.15)", color: "#f97316", border: "rgba(249,115,22,0.35)", label: "Crunchyroll"  },
  netflix:     { bg: "rgba(239,68,68,0.15)",  color: "#ef4444", border: "rgba(239,68,68,0.35)",  label: "Netflix"      },
  disney:      { bg: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "rgba(59,130,246,0.35)", label: "Disney+"      },
  amazon:      { bg: "rgba(234,179,8,0.15)",  color: "#eab308", border: "rgba(234,179,8,0.35)",  label: "Prime Video"  },
  alternativa: { bg: "rgba(113,113,122,0.15)",color: "#a1a1aa", border: "rgba(113,113,122,0.3)", label: "Alternativa"  },
};

const getPlatform = (status) =>
  PLATFORM_STYLES[status] ?? { bg: "rgba(113,113,122,0.15)", color: "#a1a1aa", border: "rgba(113,113,122,0.3)", label: status };

export default function AnimeCard({ anime, onClick }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const platform = getPlatform(anime.status);

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      onClick={() => onClick(anime)}
      className="rounded-xl overflow-hidden cursor-pointer border transition-colors"
      style={{
        background: isDark ? "#181818" : "#f7f8fa",
        borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
      }}
    >
      <div className="relative">
        <img
          loading="lazy"
          src={anime.imageUrl}
          alt={anime.title}
          className="w-full object-cover block"
          style={{ height: "280px" }}
        />

        {/* badge mejorado */}
        <div
          className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg"
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
            className="text-[12px] font-bold tracking-wide"
            style={{ color: platform.color }}
          >
            {platform.label}
          </span>
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }}
        />
      </div>

      <div
        className="flex flex-col items-center justify-center gap-1.5 px-3"
        style={{ height: "72px" }}
      >
        <h3
          className="text-[14px] font-bold leading-snug text-center"
          style={{
            color: isDark ? "#f0f0f0" : "#111111",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {anime.title}
        </h3>
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: isDark ? "#71717a" : "#6b7280", fontFamily: "monospace" }}
        >
          <Clock size={13} aria-hidden="true" />
          {anime.time}
        </div>
      </div>
    </motion.div>
  );
}