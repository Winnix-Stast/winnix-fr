import { privateFetcher } from "../api/api.config";

export const teamsAdapter = {
  getOwnTeams: async (query: any) => {
    const response = await privateFetcher.instance.get("/teams/my-teams", { params: query });
    return response.data;
  },
  createTeam: async (payload: any) => {
    const response = await privateFetcher.instance.post("/teams", payload);
    return response.data;
  },
};
