import { CreatePrizePayload, prizesAdapter } from '../prizes.adapter';

export const prizesActions = {
  getByEditionAction: async (editionId: string): Promise<any[]> => {
    try {
      const data = await prizesAdapter.getByEdition(editionId);
      return data?.data || [];
    } catch (error) {
      console.error('getByEditionAction error :>> ', error);
      return [];
    }
  },

  createPrizeAction: async (payload: CreatePrizePayload): Promise<any> => {
    try {
      const data = await prizesAdapter.create(payload);
      return data?.data || null;
    } catch (error: any) {
      console.error('createPrizeAction error :>> ', error?.response?.data || error);
      throw error;
    }
  },

  updatePrizeAction: async (
    id: string,
    payload: Partial<CreatePrizePayload>,
  ): Promise<any> => {
    try {
      const data = await prizesAdapter.update(id, payload);
      return data?.data || null;
    } catch (error: any) {
      console.error('updatePrizeAction error :>> ', error?.response?.data || error);
      throw error;
    }
  },

  deletePrizeAction: async (id: string): Promise<void> => {
    try {
      await prizesAdapter.remove(id);
    } catch (error: any) {
      console.error('deletePrizeAction error :>> ', error?.response?.data || error);
      throw error;
    }
  },
};
