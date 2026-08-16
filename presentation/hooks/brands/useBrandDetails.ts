import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router';
import { brandsActions } from '@/core/brands/actions/brands-actions';
import { tournamentsActions } from '@/core/tournaments/actions/tournaments-actions';
import { getTournamentStatusConfig } from '@/presentation/styles';

export const useBrandDetails = () => {
  const { brandId, id } = useLocalSearchParams<{ brandId: string; id: string }>();
  const resolvedId = brandId || id;
  const router = useRouter();
  const navigation = useNavigation();

  const {
    data: brand,
    isLoading: loadingBrand,
    refetch: refetchBrand,
  } = useQuery({
    queryKey: ['brand', resolvedId],
    queryFn: () => brandsActions.getBrandByIdAction(resolvedId as string),
    enabled: !!resolvedId,
  });

  const {
    data: editions,
    isLoading: loadingEditions,
    refetch: refetchEditions,
  } = useQuery({
    queryKey: ['editions-by-brand', resolvedId],
    queryFn: () => tournamentsActions.getEditionsByBrandAction(resolvedId as string),
    enabled: !!resolvedId,
  });

  useFocusEffect(
    useCallback(() => {
      if (resolvedId) {
        refetchBrand();
        refetchEditions();
      }
    }, [resolvedId, refetchBrand, refetchEditions]),
  );

  useEffect(() => {
    if (brand?.name) {
      navigation.setOptions({ title: brand.name });
    }
  }, [brand, navigation]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const statusLabel = (status: string) => {
    const config = getTournamentStatusConfig(status);
    return {
      label: config.label,
      color: config.color,
    };
  };

  return {
    resolvedId,
    router,
    brand,
    loadingBrand,
    editions,
    loadingEditions,
    formatDate,
    statusLabel,
  };
};
