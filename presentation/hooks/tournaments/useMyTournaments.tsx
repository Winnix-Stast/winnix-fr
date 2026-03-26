import { useQuery } from "@tanstack/react-query";
import { tournamentsActions } from "@/core/tournaments/actions/tournaments-actions";

export const useMyTournaments = () => {
  const { data: tournaments, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['own-tournaments'],
    queryFn: async () => {
      const data = await tournamentsActions.getOwnTournamentsAction({});
      return data || [];
    },
  });

  return {
    tournaments: tournaments || [],
    loading: isLoading,
    error: error ? "No se pudieron cargar los torneos" : null,
    refresh: refetch,
    isRefreshing: isRefetching,
  };
};
