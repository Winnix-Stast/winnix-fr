import { privateFetcher } from "../api/api.config";

export const tournamentAdapter = {
  getOwnTournaments: async (query: any) => {
    const response = await privateFetcher.instance.post(`/tournaments/own-tournaments`, query);
    return response.data;
  },

  getTournamentById: async (id: string) => {
    const response = await privateFetcher.instance.get(`/tournaments/${id}`);
    return response.data;
  },

  createTournament: async (payload: any) => {
    const response = await privateFetcher.instance.post("/tournaments", payload);
    return response.data;
  },
};
