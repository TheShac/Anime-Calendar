import { useEffect, useState } from "react";
import {
  getWeeklyCalendar, getWeeklyCalendarCached,
  getNextSeasonCalendar, getNextCalendarCached,
} from "../services/calendar.service";

const INITIAL_CALENDAR = {
  season: null,
  days: { lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], domingo:[] },
};

export function useWeeklyAnimes(mode = "current") {
  const [calendar, setCalendar] = useState(INITIAL_CALENDAR);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    let mounted = true;

    const isNext    = mode === "next";
    const getFresh  = isNext ? getNextSeasonCalendar : getWeeklyCalendar;
    const getCached = isNext ? getNextCalendarCached : getWeeklyCalendarCached;

    const fetchCalendar = async () => {
      setLoading(true);
      setError(null);

      const cached = getCached();
      if (cached && mounted) {
        setCalendar(cached);
        setLoading(false);
      }

      try {
        const fresh = await getFresh();
        if (!mounted) return;
        setCalendar(fresh);
      } catch (err) {
        if (!mounted) return;
        // si es "next" y no hay temporada próxima, muestra mensaje amigable
        if (isNext) {
          setError("No hay próxima temporada configurada aún.");
        } else if (!cached) {
          setError(err.message);
        }
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchCalendar();
    return () => { mounted = false; };
  }, [mode]);

  return { calendar, loading, error };
}