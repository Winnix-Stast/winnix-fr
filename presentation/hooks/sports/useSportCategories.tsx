import { sportsAdapter } from "@/core/sports/sports-adapter";
import { QUERY_PRESETS, useQueryAdapter } from "@/helpers/adapters/queryAdapter";

export const useSportCategories = (sportId?: string) => {
  const { data, isLoading, isError, error, refetch } = useQueryAdapter<any, Error>(["sport-categories", sportId], () => sportsAdapter.getCategoriesBySport(sportId!), {
    ...QUERY_PRESETS.SEMI_STATIC,
    enabled: !!sportId,
  });

  return {
    categories: data?.data || [],
    loading: isLoading,
    error: isError ? error?.message : null,
    refresh: refetch,
  };
};
