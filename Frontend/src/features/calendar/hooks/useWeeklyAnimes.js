import { useEffect, useState } from "react";
import { getWeeklyCalendar, getWeeklyCalendarCached } from "../services/calendar.service";

const INITIAL_CALENDAR = {
  season: null,
  days: {
    lunes: [], martes: [], miercoles: [],
    jueves: [], viernes: [], sabado: [], domingo: [],
  },
};

export function useWeeklyAnimes() {
  const [calendar, setCalendar] = useState(INITIAL_CALENDAR);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchCalendar = async () => {
      const cached = getWeeklyCalendarCached();
      if (cached && mounted) {
        setCalendar(cached);
        setLoading(false);
      }

      try {
        const fresh = await getWeeklyCalendar();
        if (!mounted) return;
        setCalendar(fresh);
      } catch (err) {
        if (!mounted) return;
        if (!cached) setError(err.message);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchCalendar();
    return () => { mounted = false; };
  }, []);

  return { calendar, loading, error };
}