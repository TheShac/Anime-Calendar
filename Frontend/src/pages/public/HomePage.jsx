import { useMemo, useState, useEffect } from "react";

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

  const { calendar, loading, error } = useWeeklyAnimes();

  const [selectedDay,  setSelectedDay]  = useState("todos");
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [viewMode,     setViewMode]     = useState("weekly");

  // título de pestaña
  useEffect(() => {
    document.title = "AniCalendar — Calendario de Anime";
  }, []);

  // en móvil fuerza vista diaria
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setViewMode("daily");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: isDark ? "#0a0a0a" : "#f0f2f5",
          padding: "16px 4%",
        }}
      >
        <WeeklyGridSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
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