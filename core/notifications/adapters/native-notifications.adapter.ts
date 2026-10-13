import * as Haptics from 'expo-haptics';

export const nativeNotificationsAdapter = {
  /**
   * Disparar vibración física háptica en el dispositivo móvil
   * Funciona tanto en local como en producción (iOS y Android)
   */
  triggerNotificationVibration: async (
    type: 'success' | 'warning' | 'error' | 'medium',
  ) => {
    try {
      if (type === 'success') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (type === 'warning') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else if (type === 'error') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch {
      // Entornos web o simuladores sin motor de vibración
    }
  },

  /**
   * Solicitar permisos nativos de notificaciones en el sistema operativo
   */
  requestNativePermissions: async (): Promise<boolean> => {
    // =========================================================================
    // TODO: NATIVE OS PERMISSIONS (expo-notifications)
    // Para activar banners y alertas nativas en la barra de estado de iOS/Android:
    // 1. Ejecutar en terminal: npx expo install expo-notifications
    // 2. Descomentar el siguiente bloque:
    //
    // import * as Notifications from 'expo-notifications';
    // const { status: existingStatus } = await Notifications.getPermissionsAsync();
    // let finalStatus = existingStatus;
    // if (existingStatus !== 'granted') {
    //   const { status } = await Notifications.requestPermissionsAsync();
    //   finalStatus = status;
    // }
    // if (finalStatus !== 'granted') return false;
    // const tokenData = await Notifications.getExpoPushTokenAsync();
    // console.log('Expo Push Token:', tokenData.data);
    // // Guardar token en backend para envíos remotos
    // return true;
    // =========================================================================
    console.log(
      '[NATIVE_NOTIFICATIONS] Permissions check requested (Ready for expo-notifications)',
    );
    return true;
  },

  /**
   * Disparar notificación local nativa del dispositivo
   * Vibración háptica en local + Banner en el sistema operativo en producción
   */
  scheduleLocalNativeNotification: async (
    title: string,
    body: string,
    data?: Record<string, any>,
  ) => {
    // Vibración háptica instantánea en el dispositivo
    await nativeNotificationsAdapter.triggerNotificationVibration('success');

    // =========================================================================
    // TODO: BANNER NATIVO EN LA BARRA DE ESTADO (expo-notifications)
    // Para mostrar el banner emergente en la parte superior del celular:
    //
    // import * as Notifications from 'expo-notifications';
    // await Notifications.scheduleNotificationAsync({
    //   content: {
    //     title,
    //     body,
    //     data: data || {},
    //     sound: 'default',
    //     vibrate: [0, 250, 250, 250],
    //   },
    //   trigger: null, // Disparo inmediato
    // });
    // =========================================================================
    console.log(
      `[NATIVE_NOTIFICATIONS] Local native alert: "${title}" - "${body}"`,
      data,
    );
  },

  /**
   * Actualizar el badge/contador visual en el icono exterior de la app móvil
   */
  updateAppIconBadgeCount: async (unreadCount: number) => {
    // =========================================================================
    // TODO: EXPO-NOTIFICATIONS BADGE
    // Para actualizar el número rojo sobre el ícono de la app en la pantalla de inicio:
    //
    // import * as Notifications from 'expo-notifications';
    // await Notifications.setBadgeCountAsync(unreadCount);
    // =========================================================================
    console.log(`[NATIVE_NOTIFICATIONS] App Icon Badge: ${unreadCount}`);
  },
};
