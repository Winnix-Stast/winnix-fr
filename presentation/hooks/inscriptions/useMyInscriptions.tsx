import { useQuery } from '@tanstack/react-query';
import { inscriptionsActions } from '@/core/inscriptions/actions/inscriptions-actions';

export const useMyInscriptions = () => {
  const {
    data: inscriptions,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['my-inscriptions'],
    queryFn: () => inscriptionsActions.getMyInscriptionsAction(),
  });

  return {
    inscriptions: inscriptions || [],
    loading: isLoading,
    error: error ? 'No se pudieron cargar las inscripciones' : null,
    refresh: refetch,
    isRefreshing: isRefetching,
  };
};
