import { sportsAdapter } from "@/core/sports/sports-adapter";
import { QUERY_PRESETS, useQueryAdapter } from "@/helpers/adapters/queryAdapter";

export const useSports = () => {
  const { data, isLoading, isError, error, refetch } = useQueryAdapter<any, Error>(["sports", "list"], () => sportsAdapter.getSports(), {
    ...QUERY_PRESETS.SEMI_STATIC,
  });

  return {
    sports: data?.data || [],
    loading: isLoading,
    error: isError ? error?.message : null,
    refresh: refetch,
  };
};

export const useSportCategories = (sportId: string | undefined) => {
  const { data, isLoading, isError, error } = useQueryAdapter<any, Error>(
    ["sport-categories", sportId || ""],
    () => sportsAdapter.getCategoriesBySport(sportId!),
    {
      ...QUERY_PRESETS.SEMI_STATIC,
      enabled: !!sportId,
    },
  );

  return {
    categories: data?.data || [],
    loadingCategories: isLoading,
    errorCategories: isError ? error?.message : null,
  };
};
