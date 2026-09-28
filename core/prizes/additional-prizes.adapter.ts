import { privateFetcher } from '../api/api.config';

export interface AdditionalPrizeItem {
  _id: string;
  name: string;
  icon?: string;
  description?: string;
}

export const additionalPrizesAdapter = {
  getAll: async (): Promise<AdditionalPrizeItem[]> => {
    try {
      const response = await privateFetcher.instance.get('/additional-prizes');
      return response.data?.data || [];
    } catch (error: any) {
      console.error('Error fetching additional prizes:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Error al obtener el catálogo de premios adicionales.';
      throw new Error(errorMessage);
    }
  },
};
