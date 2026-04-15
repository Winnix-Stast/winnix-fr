import { useQuery } from "@tanstack/react-query";
import { brandsActions } from "@/core/brands/actions/brands-actions";

export const useMyBrands = () => {
  const { data: brands, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['my-brands'],
    queryFn: () => brandsActions.getMyBrandsAction(),
  });

  return {
    brands: brands || [],
    loading: isLoading,
    error: error ? "No se pudieron cargar las marcas" : null,
    refresh: refetch,
    isRefreshing: isRefetching,
  };
};
