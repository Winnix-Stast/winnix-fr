import { privateFetcher } from "../api/api.config";

export const teamsAdapter = {
  getOwnTeams: async (query: any) => {
    const response = await privateFetcher.get("/teams/my-teams", { params: query });
    return response;
  },
  createTeam: async (payload: any) => {
    const response = await privateFetcher.post("/teams", payload);
    return response;
  },
  updateTeam: async (id: string, payload: any) => {
    const response = await privateFetcher.patch(`/teams/${id}`, payload);
    return response;
  },
  deleteTeam: async (id: string) => {
    const response = await privateFetcher.delete(`/teams/${id}`);
    return response;
  },
  getTeamById: async (id: string) => {
    const response = await privateFetcher.get(`/teams/${id}`);
    return response;
  },
};
