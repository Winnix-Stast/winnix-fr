import { privateFetcher } from '../api/api.config';

export interface CreatePrizePayload {
  tournamentEdition: string;
  label: string;
  reward?: string;
  cashAmount?: number | null;
  currency?: string;
  additionalItems?: string[];
  position?: number | null;
  isMainPrize?: boolean;
  icon?: string;
  order?: number;
}

export const prizesAdapter = {
  getByEdition: async (editionId: string) => {
    const response = await privateFetcher.instance.get(
      `/tournament-prizes/edition/${editionId}`,
    );
    return response.data;
  },

  create: async (payload: CreatePrizePayload) => {
    const response = await privateFetcher.instance.post('/tournament-prizes', payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<CreatePrizePayload>) => {
    const response = await privateFetcher.instance.patch(
      `/tournament-prizes/${id}`,
      payload,
    );
    return response.data;
  },

  remove: async (id: string) => {
    const response = await privateFetcher.instance.delete(`/tournament-prizes/${id}`);
    return response.data;
  },
};
