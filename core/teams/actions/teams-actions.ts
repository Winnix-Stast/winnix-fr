import { teamsAdapter } from "../teams-adapter";

export interface CreateTeamPayload {
  name: string;
  logo?: string;
  sport: string;
  isFavorite?: boolean;
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

  updateTeamAction: async (id: string, payload: Partial<CreateTeamPayload>): Promise<any | null> => {
    try {
      const data = await teamsAdapter.updateTeam(id, payload);
      return data;
    } catch (error) {
      console.error("updateTeamAction error :>> ", error);
      return null;
    }
  },

  toggleFavoriteAction: async (id: string, isFavorite: boolean): Promise<any | null> => {
    try {
      const data = await teamsAdapter.updateTeam(id, { isFavorite });
      return data;
    } catch (error) {
      console.error("toggleFavoriteAction error :>> ", error);
      return null;
    }
  },

  deleteTeamAction: async (id: string): Promise<any | null> => {
    try {
      const data = await teamsAdapter.deleteTeam(id);
      return data;
    } catch (error) {
      console.error("deleteTeamAction error :>> ", error);
      return null;
    }
  },
};
