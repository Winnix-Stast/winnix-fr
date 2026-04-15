import { privateFetcher } from "../api/api.config";

export const tournamentAdapter = {
  createEdition: async (payload: any) => {
    const response = await privateFetcher.instance.post("/tournament-editions", payload);
    return response.data;
  },

  getAllEditions: async () => {
    const response = await privateFetcher.instance.get("/tournament-editions");
    return response.data;
  },

  getEditionsByBrand: async (brandId: string) => {
    const response = await privateFetcher.instance.get(`/tournament-editions/tournament/${brandId}`);
    return response.data;
  },

  getEditionById: async (id: string) => {
    const response = await privateFetcher.instance.get(`/tournament-editions/${id}`);
    return response.data;
  },
};
