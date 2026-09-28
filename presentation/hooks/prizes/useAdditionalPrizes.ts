import { useQuery } from '@tanstack/react-query';
import { additionalPrizesAdapter } from '@/core/prizes/additional-prizes.adapter';

export const useAdditionalPrizes = () => {
  return useQuery({
    queryKey: ['additional-prizes-catalog'],
    queryFn: () => additionalPrizesAdapter.getAll(),
  });
};
