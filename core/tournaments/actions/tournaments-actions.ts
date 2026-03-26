import { tournamentAdapter } from "../tournaments.adapter";

export interface CreateTournamentPayload {
  name: string;
  description?: string;
  image?: string;
  logo?: string;
  organizer: string;
  start_date: string;
  end_date: string;
  config: {
    max_teams: number;
    teams?: string[];
    stages?: string[];
  };
  agreement: {
    accepted: boolean;
    acceptedAt?: string | Date;
  };
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

  getTournamentByIdAction: async (id: string): Promise<any | null> => {
    try {
      const data = await tournamentAdapter.getTournamentById(id);
      return data.data;
    } catch (error) {
      console.error("getTournamentByIdAction error :>> ", error);
      return null;
    }
  },

  createTournamentAction: async (payload: CreateTournamentPayload): Promise<any | null> => {
    try {
      const data = await tournamentAdapter.createTournament(payload);
      return data;
    } catch (error: any) {
      console.error("createTournamentAction error :>> ", error?.response?.data || error);
      throw error;
    }
  },
};
