import { tournamentsActions } from '@/core/tournaments/actions/tournaments-actions';
import { useInfiniteQueryAdapter } from '@/helpers/adapters/queryAdapter';

export const useTournamentsInfinite = (
  filters: {
    search?: string;
    status?: string;
    sport?: string;
  } = {},
) => {
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQueryAdapter(
    ['all-editions', filters],
    (pageParam) =>
      tournamentsActions.getEditionsPaginatedAction({
        page: pageParam,
        limit: 20,
        search: filters.search,
        status: filters.status,
        sport: filters.sport,
      }),
    {
      staleTime: 0,
    },
  );

  const tournaments =
    responseData?.pages.flatMap((page: any) => page.editions || []).filter(Boolean) || [];

  return {
    tournaments,
    loading: isLoading,
    error: isError ? error?.message : null,
    refresh: refetch,
    fetchNextPage,
    hasNextPage,
    isRefreshing: isFetchingNextPage,
  };
};
