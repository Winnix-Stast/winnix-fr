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

  updateStageAction: async (id: string, stageData: any) => {
    try {
      const response = await privateFetcher.patch<any>(`/stages/${id}`, stageData);
      return response;
    } catch (error) {
      console.error('Error updating stage:', error);
      throw error;
    }
  },

  deleteStageAction: async (id: string) => {
    try {
      const response = await privateFetcher.delete<any>(`/stages/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting stage:', error);
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
