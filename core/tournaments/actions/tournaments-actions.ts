import { tournamentAdapter } from "../tournaments.adapter";

export interface CreateEditionPayload {
  tournament: string;
  seasonName: string;
  startDate: string;
  endDate?: string;
  sport: string;
  sportCategory?: string;
}

export const tournamentsActions = {
  getAllEditionsAction: async (): Promise<any[]> => {
    try {
      const data = await tournamentAdapter.getAllEditions();
      return data?.data || [];
    } catch (error) {
      console.error("getAllEditionsAction error :>> ", error);
      return [];
    }
  },

  createEditionAction: async (payload: CreateEditionPayload): Promise<any> => {
    try {
      const data = await tournamentAdapter.createEdition(payload);
      return data;
    } catch (error: any) {
      console.error("createEditionAction error :>> ", error?.response?.data || error);
      throw error;
    }
  },

  getEditionsByBrandAction: async (brandId: string): Promise<any[]> => {
    try {
      const data = await tournamentAdapter.getEditionsByBrand(brandId);
      return data?.data || [];
    } catch (error) {
      console.error("getEditionsByBrandAction error :>> ", error);
      return [];
    }
  },

  getEditionByIdAction: async (id: string): Promise<any | null> => {
    try {
      const data = await tournamentAdapter.getEditionById(id);
      return data?.data || null;
    } catch (error) {
      console.error("getEditionByIdAction error :>> ", error);
      return null;
    }
  },
};
