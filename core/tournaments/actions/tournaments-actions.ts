import { tournamentAdapter } from "../tournaments.adapter";

export interface CreateTournamentPayload {
  name: string;
  start_date: string;
  end_date: string;
  max_teams: number;
  prize: number;
  image?: string;
  logo?: string;
  sponsors?: string[];
  rules?: string;
}

export const tournamentsActions = {
  getOwnTournamentsAction: async (query: any): Promise<any | null> => {
    try {
      const data = await tournamentAdapter.getOwnTournaments(query);
      return data.data;
    } catch (error) {
      console.error("getOwnTournamentsAction error :>> ", error);
      return null;
    }
  },

  createTournamentAction: async (payload: CreateTournamentPayload): Promise<any | null> => {
    try {
      const data = await tournamentAdapter.createTournament(payload);
      return data;
    } catch (error) {
      console.error("createTournamentAction error :>> ", error);
      return null;
    }
  },
};
