import { useEffect, useState } from "react";
import { getAnimes } from "../services/anime.service";
import { getCalendarEntries } from "../services/calendar-entry.service";

export function useAnimes() {
  const [animes,  setAnimes]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchAnimes = async () => {
    try {
      setLoading(true);

      const [animesData, calendarData] = await Promise.all([
        getAnimes(),
        getCalendarEntries().catch(() => []),
      ]);

      const entries = Array.isArray(calendarData) ? calendarData : [];

      const merged = animesData.map((anime) => {
        const entry = entries.find((e) => e.animeId === anime.id);
        return {
          ...anime,
          calendarEntryId: entry?.id        ?? null,
          dayOfWeek:       entry?.dayOfWeek ?? "",
          time:            entry?.time      ?? "",
          seasonId:        entry?.seasonId  ?? "",
          seasonName:      entry?.seasonName ?? "",
        };
      });
      console.log("calendarData:", calendarData);
      console.log("entries:", entries);
      setAnimes(merged);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { fetchAnimes(); }, []);

  return { animes, loading, error, refetch: fetchAnimes };
}