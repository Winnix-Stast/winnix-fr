import { QueryKey, useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";

export const QUERY_PRESETS = {
  STATIC: { staleTime: 30 * 60 * 1000 },
  SEMI_STATIC: { staleTime: 5 * 60 * 1000 },
  REALTIME: { staleTime: 0 },
};

export const useQueryAdapter = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
  queryKey: QueryKey | string,
  queryFn: () => Promise<any>,
  options: Omit<UseQueryOptions<TQueryFnData, TError, TData>, "queryKey" | "queryFn"> & {
    onError?: (error: unknown) => void;
    cacheTime?: number;
  } = {},
) => {
  const { enabled = true, staleTime = 0, cacheTime = 5 * 60 * 1000, refetchOnWindowFocus = false, refetchOnMount = true, onError, ...restOptions } = options;

  return useQuery<TQueryFnData, TError, TData>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async () => {
      try {
        const response = await queryFn();

        if (response?.success && response?.data !== undefined) {
          return response.data;
        }

        if (response?.success === false) {
          throw new Error(response.error);
        }

        return response;
      } catch (error) {
        if (onError) {
          onError(error);
        }
        throw error;
      }
    },
    enabled,
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus,
    refetchOnMount,
    ...(restOptions as any),
  });
};

export const useMutationAdapter = <TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<any>,
  options: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, "mutationFn"> & {
    successMessage?: string;
    errorMessage?: string;
    invalidateQueries?: QueryKey[];
    onError?: (error: any, variables: TVariables, context: TContext | undefined) => void;
    onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void;
  } = {},
) => {
  const { onSuccess, onError, successMessage, errorMessage, invalidateQueries = [], ...restOptions } = options;
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: async (variables: TVariables) => {
      try {
        const response = await mutationFn(variables);

        if (response?.success === false) {
          throw {
            response: {
              data: response,
            },
          };
        }
        return response?.data !== undefined ? response.data : response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data, variables, context) => {
      if (Array.isArray(invalidateQueries) && invalidateQueries.length > 0) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({
            queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
          });
        });
      }

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (onError) {
        onError(error, variables, context);
      }
    },
    ...restOptions,
  });
};

export const createQueryKeyFactory = (baseKey: string) => ({
  all: [baseKey],
  lists: () => [...createQueryKeyFactory(baseKey).all, "list"],
  list: (filters: Record<string, any>) => [...createQueryKeyFactory(baseKey).lists(), { filters }],
  details: () => [...createQueryKeyFactory(baseKey).all, "detail"],
  detail: (id: string | number) => [...createQueryKeyFactory(baseKey).details(), id],
});
