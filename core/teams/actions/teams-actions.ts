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
      const data: any = await teamsAdapter.getOwnTeams(query);
      return data?.data;
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

  addMemberAction: async (teamId: string, playerId: string): Promise<any | null> => {
    try {
      console.log(`⚡ [addMemberAction] Reclutando playerId: ${playerId} al equipo: ${teamId}`);
      const data = await teamsAdapter.addMember(teamId, playerId);
      console.log('✅ [addMemberAction] Miembro agregado exitosamente:', JSON.stringify(data));
      return data;
    } catch (error: any) {
      console.log('❌ [addMemberAction] Error al reclutar:', error?.statusCode || error?.message || error);
      throw error;
    }
  },

  respondInvitationAction: async (teamId: string, action: 'ACCEPT' | 'REJECT'): Promise<any> => {
    try {
      console.log(`⚡ [respondInvitationAction] Respond invitation teamId: ${teamId}, action: ${action}`);
      const data = await teamsAdapter.respondInvitation(teamId, action);
      return data;
    } catch (error: any) {
      console.log('❌ [respondInvitationAction] Error al responder invitación:', error?.message || error);
      throw error;
    }
  },

  searchUserByTermAction: async (term: string): Promise<any | null> => {
    try {
      console.log('🔍 [searchUserByTermAction] Enviando petición para término:', term);
      const res: any = await teamsAdapter.searchUserByTerm(term);
      console.log('✅ [searchUserByTermAction] Respuesta obtenida:', JSON.stringify(res));

      // AxiosAdapter ya desempaqueta la propiedad .data
      const user = res?.data?.data || res?.data || res;
      if (user && (user._id || user.id)) {
        return user;
      }
      return null;
    } catch (error: any) {
      console.log(
        '❌ [searchUserByTermAction] Error o no encontrado:',
        error?.statusCode || error?.status || error?.message || error,
      );
      return null;
    }
  },

  createQuickUserAction: async (payload: { username: string; email: string }): Promise<any | null> => {
    try {
      const data: any = await teamsAdapter.createQuickUser(payload);
      return data?.data?.data || data?.data;
    } catch (error) {
      console.error("createQuickUserAction error :>> ", error);
      throw error;
    }
  },
};
