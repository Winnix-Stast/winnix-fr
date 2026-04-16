import { privateFetcher } from '../api/api.config';

export const teamsAdapter = {
  getOwnTeams: async (params?: { page?: number; limit?: number }) => {
    const response = await privateFetcher.get('/teams/my-teams', { params });
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
  getTeamById: async (id: string) => {
    const response = await privateFetcher.get(`/teams/${id}`);
    return response;
  },
  getTeamMembers: async (
    teamId: string,
    params?: { status?: string; page?: number; limit?: number },
  ) => {
    const response = await privateFetcher.get(`/teams/${teamId}/members`, {
      params,
    });
    return response;
  },
  deactivateMember: async (teamId: string, playerId: string) => {
    const response = await privateFetcher.patch(
      `/teams/${teamId}/members/${playerId}/deactivate`,
      {},
    );
    return response;
  },
  activateMember: async (teamId: string, playerId: string) => {
    const response = await privateFetcher.patch(
      `/teams/${teamId}/members/${playerId}/reactivate`,
      {},
    );
    return response;
  },
};
