import { teamsAdapter } from "../teams.adapter";

export interface CreateTeamPayload {
  name: string;
  logo?: string;
}

export const teamsActions = {
  getOwnTeamsAction: async (query: any): Promise<any | null> => {
    try {
      const data = await teamsAdapter.getOwnTeams(query);
      return data.data;
    } catch (error) {
      console.error("getOwnTeamsAction error :>> ", error);
      return null;
    }
  },

  createTeamAction: async (payload: CreateTeamPayload): Promise<any | null> => {
    try {
      const data = await teamsAdapter.createTeam(payload);
      return data;
    } catch (error) {
      console.error("createTeamAction error :>> ", error);
      return null;
    }
  },
};
