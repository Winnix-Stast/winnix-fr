import { privateFetcher } from "../api/api.config";

export const inscriptionsAdapter = {
  createInscription: async (payload: { team: string; tournamentEdition: string; players?: string[] }) => {
    const response = await privateFetcher.post("/tournament-inscriptions", payload);
    return response;
  },

  getByEdition: async (editionId: string) => {
    const response = await privateFetcher.get(`/tournament-inscriptions/tournament/${editionId}`);
    return response;
  },

  getMyInscriptions: async () => {
    const response = await privateFetcher.get("/tournament-inscriptions/my-inscriptions");
    return response;
  },
};
