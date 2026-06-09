import { tournamentAdapter } from '../tournaments.adapter';

export interface CreateEditionPayload {
  tournament: string;
  seasonName: string;
  startDate: string;
  endDate?: string;
  sport: string;
  sportCategory?: string;
  sportTemplate: string;
  playersPerTeam?: number;
  matchDuration?: number;
  scoring?: { win: number; draw: number; loss: number };
  config?: Record<string, any>;
  image?: string;
  logo?: string;
}

export const tournamentsActions = {
  getAllEditionsAction: async (): Promise<any[]> => {
    try {
      const data = await tournamentAdapter.getAllEditions();
      return data?.data || [];
    } catch (error) {
      console.error('getAllEditionsAction error :>> ', error);
      return [];
    }
  },

  getEditionsPaginatedAction: async (params?: Record<string, any>): Promise<any> => {
    try {
      const response = await tournamentAdapter.getAllEditions(params);
      return {
        success: response.success,
        data: {
          editions: response.data || [],
          total: response.meta?.totalItems || 0,
        },
      };
    } catch (error) {
      console.error('getEditionsPaginatedAction error :>> ', error);
      return { success: false, data: { editions: [], total: 0 } };
    }
  },

  createEditionAction: async (payload: CreateEditionPayload): Promise<any> => {
    try {
      const data = await tournamentAdapter.createEdition(payload);
      return data;
    } catch (error: any) {
      console.error('createEditionAction error :>> ', error?.response?.data || error);
      throw error;
    }
  },

  getEditionsByBrandAction: async (brandId: string): Promise<any[]> => {
    try {
      const data = await tournamentAdapter.getEditionsByBrand(brandId);
      return data?.data || [];
    } catch (error) {
      console.error('getEditionsByBrandAction error :>> ', error);
      return [];
    }
  },

  getEditionByIdAction: async (id: string): Promise<any | null> => {
    try {
      const data = await tournamentAdapter.getEditionById(id);
      return data?.data || null;
    } catch (error) {
      console.error('getEditionByIdAction error :>> ', error);
      return null;
    }
  },
};
