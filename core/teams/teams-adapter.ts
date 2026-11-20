import { privateFetcher } from '../api/api.config';

export const teamsAdapter = {
  getTeams: async (params?: { search?: string; limit?: number; page?: number }) => {
    const cleanParams: any = {};
    if (params?.search && params.search.trim().length > 0) {
      cleanParams.search = params.search.trim();
    }
    if (params?.limit) cleanParams.limit = params.limit;
    if (params?.page) cleanParams.page = params.page;

    const response = await privateFetcher.get('/teams', {
      params: cleanParams,
    });
    return response;
  },

  getAllTeams: async (params?: { search?: string; limit?: number; page?: number }) => {
    return teamsAdapter.getTeams(params);
  },

  getMyTeams: async (params?: { page?: number; limit?: number }) => {
    const response = await privateFetcher.get('/teams/my-teams', { params });
    return response;
  },

  getOwnTeams: async (params?: { page?: number; limit?: number }) => {
    const response = await privateFetcher.get('/teams/my-teams', { params });
    return response;
  },

  getTeamById: async (id: string) => {
    const response = await privateFetcher.get(`/teams/${id}`);
    return response;
  },

  getTeamMembers: async (teamId: string, params?: { status?: string; page?: number; limit?: number }) => {
    const response = await privateFetcher.get(`/teams/${teamId}/members`, {
      params,
    });
    return response;
  },

  createTeam: async (payload: any) => {
    const response = await privateFetcher.post('/teams', payload);
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

  leaveTeam: async (teamId: string) => {
    console.log(`📡 [teamsAdapter.leaveTeam] PATCH /teams/${teamId}/members/leave`);
    try {
      const response = await privateFetcher.patch(
        `/teams/${teamId}/members/leave`,
        {},
      );
      console.log(`✅ [teamsAdapter.leaveTeam] Éxito:`, JSON.stringify(response));
      return response;
    } catch (error: any) {
      console.log(`❌ [teamsAdapter.leaveTeam] Error:`, error?.response?.data || error?.message || error);
      throw error;
    }
  },

  respondInvitation: async (teamId: string, action: 'ACCEPT' | 'REJECT') => {
    console.log(`📡 [teamsAdapter.respondInvitation] PATCH /teams/${teamId}/members/respond-invitation action: ${action}`);
    try {
      const response = await privateFetcher.patch(
        `/teams/${teamId}/members/respond-invitation`,
        { action },
      );
      console.log(`✅ [teamsAdapter.respondInvitation] Éxito:`, JSON.stringify(response));
      return response;
    } catch (error: any) {
      console.log(`❌ [teamsAdapter.respondInvitation] Error:`, error?.response?.data || error?.message || error);
      throw error;
    }
  },

  deactivateMember: async (teamId: string, playerId: string) => {
    console.log(`📡 [teamsAdapter.deactivateMember] PATCH /teams/${teamId}/members/${playerId}/deactivate`);
    try {
      const response = await privateFetcher.patch(
        `/teams/${teamId}/members/${playerId}/deactivate`,
        {},
      );
      console.log(`✅ [teamsAdapter.deactivateMember] Éxito:`, JSON.stringify(response));
      return response;
    } catch (error: any) {
      console.log(`❌ [teamsAdapter.deactivateMember] Error:`, error?.response?.data || error?.message || error);
      throw error;
    }
  },

  activateMember: async (teamId: string, playerId: string) => {
    const response = await privateFetcher.patch(
      `/teams/${teamId}/members/${playerId}/reactivate`,
      {},
    );
    return response;
  },

  addMember: async (teamId: string, playerId: string) => {
    console.log(`📡 [teamsAdapter.addMember] POST /teams/${teamId}/members con playerId: ${playerId}`);
    try {
      const response = await privateFetcher.post(`/teams/${teamId}/members`, {
        playerId,
      });
      console.log(`✅ [teamsAdapter.addMember] Éxito:`, JSON.stringify(response));
      return response;
    } catch (error: any) {
      console.log(`❌ [teamsAdapter.addMember] Error:`, error?.response?.data || error?.message || error);
      throw error;
    }
  },

  requestJoinTeam: async (teamId: string, playerId: string) => {
    return teamsAdapter.addMember(teamId, playerId);
  },

  searchUserByTerm: async (term: string) => {
    const response = await privateFetcher.get(`/user/${encodeURIComponent(term)}`);
    return response;
  },

  createQuickUser: async (payload: { username: string; email: string }) => {
    const response = await privateFetcher.post('/user', payload);
    return response;
  },
};
