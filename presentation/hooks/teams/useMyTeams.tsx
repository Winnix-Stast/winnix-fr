import { teamsActions } from "@/core/teams/actions/teams-actions";
import { useEffect, useState } from "react";

export const useMyTeams = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await teamsActions.getOwnTeamsAction({});
      setTeams(data || []);
    } catch (err) {
      setError("No se pudieron cargar los equipos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    loading,
    error,
    refresh: fetchTeams,
  };
};
