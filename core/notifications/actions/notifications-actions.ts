import { privateFetcher } from '@/core/api/api.config';
import {
  FilterNotificationParams,
  NotificationItem,
  NotificationsListResponse,
} from '../interface/notification.interface';

export const notificationsActions = {
  /**
   * Obtener notificaciones personales del usuario autenticado
   */
  getNotificationsAction: async (
    params?: FilterNotificationParams,
  ): Promise<NotificationsListResponse> => {
    try {
      const queryParams: any = {};
      if (params?.category && params.category !== 'ALL') {
        queryParams.category = params.category;
      }
      if (params?.unreadOnly) {
        queryParams.unreadOnly = 'true';
      }
      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;

      const response = await privateFetcher.get<any>('/notifications', {
        params: queryParams,
      });

      const data = response?.data;
      return {
        notifications: Array.isArray(data?.notifications) ? data.notifications : [],
        total: data?.total || 0,
        unreadCount: data?.unreadCount || 0,
      };
    } catch (error) {
      console.error('Error in getNotificationsAction:', error);
      return { notifications: [], total: 0, unreadCount: 0 };
    }
  },

  /**
   * Obtener contador de notificaciones no leídas para badge
   */
  getUnreadCountAction: async (): Promise<number> => {
    try {
      const response = await privateFetcher.get<any>('/notifications/unread-count');
      const data = response?.data?.data || response?.data || response;
      return Number(data?.unreadCount) || 0;
    } catch (error) {
      console.error('Error in getUnreadCountAction:', error);
      return 0;
    }
  },

  /**
   * Marcar notificación individual como leída
   */
  markAsReadAction: async (id: string): Promise<NotificationItem | null> => {
    try {
      const response = await privateFetcher.patch<any>(`/notifications/${id}/read`, {});
      return response?.data?.data || response?.data || response || null;
    } catch (error) {
      console.error('Error in markAsReadAction:', error);
      return null;
    }
  },

  /**
   * Marcar todas las notificaciones personales como leídas
   */
  markAllAsReadAction: async (): Promise<boolean> => {
    try {
      await privateFetcher.patch<any>('/notifications/read-all', {});
      return true;
    } catch (error) {
      console.error('Error in markAllAsReadAction:', error);
      return false;
    }
  },

  /**
   * Responder a una acción interactiva (Aceptar / Rechazar)
   */
  respondNotificationAction: async (
    id: string,
    action: 'ACCEPT' | 'REJECT',
  ): Promise<NotificationItem | null> => {
    try {
      const response = await privateFetcher.post<any>(`/notifications/${id}/action`, {
        action,
      });
      return response?.data?.data || response?.data || response || null;
    } catch (error: any) {
      console.error(
        'Error in respondNotificationAction:',
        error?.response?.data || error,
      );
      throw error;
    }
  },
};
