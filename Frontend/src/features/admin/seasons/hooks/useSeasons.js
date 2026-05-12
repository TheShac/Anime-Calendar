import { useEffect, useState } from "react";
import { getSeasons } from "../services/season.service";

export function useSeasons() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchSeasons = async () => {
    try {
      setLoading(true);
      const data = await getSeasons();
      setSeasons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSeasons(); }, []);

  return { seasons, loading, error, refetch: fetchSeasons };
}