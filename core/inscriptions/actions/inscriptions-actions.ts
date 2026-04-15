import { inscriptionsAdapter } from "../inscriptions-adapter";

export const inscriptionsActions = {
  createInscriptionAction: async (payload: { team: string; tournamentEdition: string; players?: string[] }): Promise<any> => {
    try {
      const data = await inscriptionsAdapter.createInscription(payload);
      return data;
    } catch (error: any) {
      console.error("createInscriptionAction error :>> ", error?.message || error);
      throw error;
    }
  },

  getByEditionAction: async (editionId: string): Promise<any[]> => {
    try {
      const data = await inscriptionsAdapter.getByEdition(editionId);
      return (data as any)?.data || [];
    } catch (error) {
      console.error("getByEditionAction error :>> ", error);
      return [];
    }
  },

  getMyInscriptionsAction: async (): Promise<any[]> => {
    try {
      const data = await inscriptionsAdapter.getMyInscriptions();
      return (data as any)?.data || [];
    } catch (error) {
      console.error("getMyInscriptionsAction error :>> ", error);
      return [];
    }
  },
};
