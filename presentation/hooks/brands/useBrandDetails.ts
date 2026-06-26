import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { brandsActions } from '@/core/brands/actions/brands-actions';
import { tournamentsActions } from '@/core/tournaments/actions/tournaments-actions';

export const useBrandDetails = () => {
  const { brandId, id } = useLocalSearchParams<{ brandId: string; id: string }>();
  const resolvedId = brandId || id;
  const router = useRouter();
  const navigation = useNavigation();

  const { data: brand, isLoading: loadingBrand } = useQuery({
    queryKey: ['brand', resolvedId],
    queryFn: () => brandsActions.getBrandByIdAction(resolvedId as string),
    enabled: !!resolvedId,
  });

  const { data: editions, isLoading: loadingEditions } = useQuery({
    queryKey: ['editions-by-brand', resolvedId],
    queryFn: () => tournamentsActions.getEditionsByBrandAction(resolvedId as string),
    enabled: !!resolvedId,
  });

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
    const normalizedStatus = status?.toLowerCase() || '';
    const map: Record<string, { label: string; color: string }> = {
      draft: { label: 'Próximamente', color: '#f59e0b' },
      published: { label: 'Publicado', color: '#3b82f6' },
      in_progress: { label: 'En curso', color: '#10b981' },
      finished: { label: 'Finalizado', color: '#6b7280' },
      cancelled: { label: 'Cancelado', color: '#ef4444' },
    };
    return map[normalizedStatus] || { label: status, color: '#a3adb8' };
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
