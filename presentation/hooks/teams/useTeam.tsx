import { teamsAdapter } from "@/core/teams/teams-adapter";
import { createQueryKeyFactory, QUERY_PRESETS, useQueryAdapter } from "@/helpers/adapters/queryAdapter";

export const teamKeys = createQueryKeyFactory("team");

export const useTeam = (id: string) => {
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQueryAdapter<any, Error>(teamKeys.detail(id), () => teamsAdapter.getTeamById(id), {
    ...QUERY_PRESETS.SEMI_STATIC,
    enabled: !!id,
  });

  return {
    team: responseData?.data || null,
    loading: isLoading,
    error: isError ? error?.message : null,
    refresh: refetch,
  };
};
