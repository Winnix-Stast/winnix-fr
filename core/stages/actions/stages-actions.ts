import { privateFetcher } from '@/core/api/api.config';

export const stagesActions = {
  getStagesByEditionAction: async (editionId: string) => {
    try {
      const response = await privateFetcher.get<any>(`/stages/edition/${editionId}`);
      return response;
    } catch (error) {
      console.error('Error fetching stages:', error);
      throw error;
    }
  },

  createStageAction: async (stageData: any) => {
    try {
      const response = await privateFetcher.post<any>('/stages', stageData);
      return response;
    } catch (error) {
      console.error('Error creating stage:', error);
      throw error;
    }
  },

  getStageTemplatesAction: async () => {
    try {
      const response = await privateFetcher.get<any>('/stage-templates');
      return response;
    } catch (error) {
      console.error('Error fetching stage templates:', error);
      throw error;
    }
  },
};

