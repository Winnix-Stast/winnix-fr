import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { notificationsActions } from '@/core/notifications/actions/notifications-actions';
import { nativeNotificationsAdapter } from '@/core/notifications/adapters/native-notifications.adapter';
import { NotificationCategory } from '@/core/notifications/interface/notification.interface';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<
    NotificationCategory | 'UNREAD'
  >('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Solicitar permisos nativos del dispositivo para notificaciones al entrar al módulo
  useEffect(() => {
    nativeNotificationsAdapter.requestNativePermissions();
  }, []);

  // 1. Query principal con paginación infinita (15 notificaciones más recientes por página)
  const notificationsQuery = useInfiniteQuery({
    queryKey: ['notifications', selectedCategory],
    queryFn: ({ pageParam = 1 }) =>
      notificationsActions.getNotificationsAction({
        category: selectedCategory === 'UNREAD' ? undefined : selectedCategory,
        unreadOnly: selectedCategory === 'UNREAD',
        page: pageParam,
        limit: 15,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce(
        (acc, page) => acc + (page.notifications?.length || 0),
        0,
      );
      if (loadedCount < lastPage.total) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  // 2. Query de contador de no leídas para badge
  const unreadCountQuery = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      const count = await notificationsActions.getUnreadCountAction();
      nativeNotificationsAdapter.updateAppIconBadgeCount(count);
      return count;
    },
  });

  // 3. Mutación: Marcar como leída
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationsActions.markAsReadAction(id),
    onSuccess: () => {
      nativeNotificationsAdapter.triggerNotificationVibration('medium');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });

  // 4. Mutación: Marcar todas como leídas
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsActions.markAllAsReadAction(),
    onSuccess: () => {
      nativeNotificationsAdapter.triggerNotificationVibration('success');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
      useAlertStore.getState().showAlert({
        title: '¡Todo al día!',
        message: 'Todas las notificaciones han sido marcadas como leídas.',
        type: 'success',
        confirmText: 'Genial',
      });
    },
  });

  // 5. Mutación: Responder a una acción (Aceptar / Rechazar)
  const respondActionMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'ACCEPT' | 'REJECT' }) =>
      notificationsActions.respondNotificationAction(id, action),
    onSuccess: (_, variables) => {
      nativeNotificationsAdapter.triggerNotificationVibration(
        variables.action === 'ACCEPT' ? 'success' : 'warning',
      );

      // Disparar notificación nativa en el dispositivo cuando se acepta una solicitud
      if (variables.action === 'ACCEPT') {
        nativeNotificationsAdapter.scheduleLocalNativeNotification(
          'Solicitud Aceptada',
          'Has confirmado la acción exitosamente en Winnix.',
          { notificationId: variables.id, action: variables.action },
        );
      }

      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
      useAlertStore.getState().showAlert({
        title:
          variables.action === 'ACCEPT' ? 'Solicitud Aceptada' : 'Solicitud Rechazada',
        message:
          variables.action === 'ACCEPT'
            ? 'Has aceptado la solicitud exitosamente.'
            : 'Has rechazado la solicitud.',
        type: variables.action === 'ACCEPT' ? 'success' : 'info',
        confirmText: 'Entendido',
      });
    },
    onError: (error: any) => {
      nativeNotificationsAdapter.triggerNotificationVibration('error');
      const msg = error?.response?.data?.message || 'No se pudo procesar la acción';
      useAlertStore.getState().showAlert({
        title: 'Error',
        message: String(msg),
        type: 'error',
        confirmText: 'Cerrar',
      });
    },
  });

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] }),
    ]);
    setIsRefreshing(false);
  }, [queryClient]);

  const notifications = useMemo(() => {
    if (!notificationsQuery.data?.pages) return [];
    return notificationsQuery.data.pages.flatMap((page) => page.notifications ?? []);
  }, [notificationsQuery.data]);

  const totalNotifications = notificationsQuery.data?.pages?.[0]?.total ?? 0;
  const unreadCount =
    unreadCountQuery.data ?? notificationsQuery.data?.pages?.[0]?.unreadCount ?? 0;

  return {
    notifications,
    unreadCount,
    totalNotifications,
    isLoading: notificationsQuery.isLoading,
    isRefreshing,
    onRefresh,
    selectedCategory,
    setSelectedCategory,
    fetchNextPage: () => notificationsQuery.fetchNextPage(),
    hasNextPage: Boolean(notificationsQuery.hasNextPage),
    isFetchingNextPage: notificationsQuery.isFetchingNextPage,
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    respondAction: (id: string, action: 'ACCEPT' | 'REJECT') =>
      respondActionMutation.mutate({ id, action }),
    isSubmittingAction: respondActionMutation.isPending,
  };
};
