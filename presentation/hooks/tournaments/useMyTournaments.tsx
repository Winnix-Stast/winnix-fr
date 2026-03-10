import { tournamentsActions } from "@/core/tournaments/actions/tournaments-actions";
import { useEffect, useState } from "react";

export const useMyTournaments = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      // Fetch tournaments for the logged-in user (organizer)
      // The query could be expanded with pagination/status
      const data = await tournamentsActions.getOwnTournamentsAction({});
      setTournaments(data || []);
    } catch (err) {
      setError("No se pudieron cargar los torneos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return {
    tournaments,
    loading,
    error,
    refresh: fetchTournaments,
  };
};
