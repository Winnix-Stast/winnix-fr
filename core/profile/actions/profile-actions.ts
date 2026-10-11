import { privateFetcher } from '@/core/api/api.config';
import { UpdateProfilePayload, UserProfile } from '../interface/profile.interface';

export const profileActions = {
  getUserProfileAction: async (userId?: string): Promise<UserProfile | null> => {
    try {
      const endpoint = userId ? `/user/${userId}` : '/user/profile';
      const response = await privateFetcher.get<any>(endpoint);
      return response?.data?.data || response?.data || response || null;
    } catch (error) {
      console.log('getUserProfileAction error :>> ', error);
      return null;
    }
  },

  updateProfileAction: async (
    payload: UpdateProfilePayload,
  ): Promise<UserProfile | null> => {
    try {
      const response = await privateFetcher.patch<any>('/user/profile', payload);
      return response?.data || response || null;
    } catch (error: any) {
      console.log('updateProfileAction error :>> ', error?.response?.data || error);
      throw error;
    }
  },
};
