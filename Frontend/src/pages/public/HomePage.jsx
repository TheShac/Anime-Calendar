import { useMemo, useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

import Header        from "../../features/calendar/components/Header";
import FilterTabs    from "../../features/calendar/components/FilterTabs";
import ViewToggle    from "../../features/calendar/components/ViewToggle";
import WeeklyGrid    from "../../features/calendar/components/WeeklyGrid";
import AnimeModal    from "../../features/calendar/components/AnimeModal";

import WeeklyGridSkeleton from "../../components/ui/skeleton/WeeklyGridSkeleton";
import ErrorState         from "../../components/ui/states/ErrorState";
import EmptyState         from "../../components/ui/states/EmptyState";

import { useWeeklyAnimes } from "../../features/calendar/hooks/useWeeklyAnimes";
import { useTheme }        from "../../context/ThemeContext";

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [mode,          setMode]          = useState("current");
  const [selectedDay,   setSelectedDay]   = useState("todos");
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [viewMode,      setViewMode]      = useState("weekly");

  const { calendar, loading, error } = useWeeklyAnimes(mode);

  useEffect(() => {
    document.title = "AniCalendar — Calendario de Anime";
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setViewMode("daily");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSelectedDay("todos");
    setViewMode("weekly");
  }, [mode]);

  const filteredDays = useMemo(() => {
    if (!calendar?.days) return {};
    if (selectedDay === "todos") {
      return {
        lunes:     calendar.days.lunes     || [],
        martes:    calendar.days.martes    || [],
        miercoles: calendar.days.miercoles || [],
        jueves:    calendar.days.jueves    || [],
        viernes:   calendar.days.viernes   || [],
        sabado:    calendar.days.sabado    || [],
        domingo:   calendar.days.domingo   || [],
      };
    }
    return { [selectedDay]: calendar.days[selectedDay] || [] };
  }, [calendar, selectedDay]);

  const SeasonToggleBtn = () => (
    <button
      onClick={() => setMode((m) => m === "current" ? "next" : "current")}
      className="flex items-center gap-2"
      style={{
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s",
        background: mode === "next"
          ? "#10b981"
          : isDark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.1)",
        color: mode === "next" ? "#000" : "#10b981",
        border: "1px solid rgba(16,185,129,0.3)",
      }}
    >
      <Sparkles size={14} aria-hidden="true" />
      {mode === "next" ? "Ver temporada actual" : "Próximos estrenos"}
    </button>
  );

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ background: isDark ? "#0a0a0a" : "#f0f2f5", padding: "16px 4%" }}
      >
        <WeeklyGridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen transition-colors"
        style={{
          background: isDark ? "#0a0a0a" : "#f0f2f5",
          color: isDark ? "#f0f0f0" : "#111111",
        }}
      >
        <Header title="AniCalendar" />
        <div style={{ padding: "16px 4%" }}>
          <div style={{ marginBottom: "20px" }}>
            <SeasonToggleBtn />
          </div>
          <EmptyState
            title="Sin próximos estrenos"
            description="Todavía no hay animes configurados para la próxima temporada."
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors"
      style={{
        background: isDark ? "#0a0a0a" : "#f0f2f5",
        color:      isDark ? "#f0f0f0" : "#111111",
      }}
    >
      <Header
        title={calendar?.season?.name}
        seasonName={calendar?.season?.seasonName}
      />

      <div style={{ padding: "16px 4%" }}>

        {/* botón alternar temporada */}
        <div style={{ marginBottom: "16px" }}>
          <SeasonToggleBtn />
        </div>

        {/* filtros */}
        <div style={{ marginBottom: "22px" }}>
          <FilterTabs
            selectedDay={selectedDay}
            onChangeDay={(day) => {
              setSelectedDay(day);
              setViewMode(day === "todos" ? "weekly" : "daily");
            }}
          />
          <div style={{ marginTop: "12px" }}>
            <ViewToggle
              viewMode={viewMode}
              setViewMode={setViewMode}
              onResetDay={setSelectedDay}
            />
          </div>
        </div>

        {/* contenido */}
        {Object.keys(filteredDays).length === 0 ? (
          <EmptyState
            title="No hay animes"
            description="Todavía no existen animes para este día"
          />
        ) : (
          <WeeklyGrid
            days={filteredDays}
            onSelectAnime={setSelectedAnime}
            viewMode={viewMode}
          />
        )}
      </div>

      <AnimeModal
        anime={selectedAnime}
        onClose={() => setSelectedAnime(null)}
      />
    </div>
  );
}