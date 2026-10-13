import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { NOTIFICATION_TYPE_CONFIG } from '@/core/notifications/constants/notifications-config';
import { NotificationItem } from '@/core/notifications/interface/notification.interface';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';

interface Props {
  item: NotificationItem;
  onPressItem?: (item: NotificationItem) => void;
  onMarkAsRead: (id: string) => void;
  onRespondAction?: (id: string, action: 'ACCEPT' | 'REJECT') => void;
  onDelete?: (id: string) => void;
  isSubmittingAction?: boolean;
}

const formatRelativeTime = (isoDate: string): string => {
  try {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;

    const d = new Date(isoDate);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  } catch {
    return '';
  }
};

export const NotificationItemCard: React.FC<Props> = ({
  item,
  onPressItem,
  onMarkAsRead,
}) => {
  const router = useRouter();

  const visualConfig =
    NOTIFICATION_TYPE_CONFIG[item.type] || NOTIFICATION_TYPE_CONFIG.SYSTEM_ALERT;

  const handlePressCard = () => {
    if (!item.isRead) {
      onMarkAsRead(item._id);
    }

    if (onPressItem) {
      onPressItem(item);
      return;
    }

    const route = visualConfig.defaultRoute?.(item.data);
    if (route) {
      router.push(route as any);
    } else {
      useAlertStore.getState().showAlert({
        title: item.title,
        message: item.message,
        type: 'info',
        confirmText: 'Entendido',
      });
    }
  };

  const isPendingAction =
    item.actionRequired &&
    (item.actionStatus === 'PENDING' || item.actionStatus === 'NONE');

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handlePressCard}
      style={[styles.cardContainer, !item.isRead && styles.cardUnread]}
    >
      {/* Indicador de no leída */}
      {!item.isRead && <View style={styles.unreadDot} />}

      <View style={styles.cardHeader}>
        {/* Badge Icon */}
        <View style={[styles.badgeCircle, { backgroundColor: visualConfig.badgeBg }]}>
          <WinnixIcon
            name={visualConfig.icon as any}
            size={19}
            color={visualConfig.badgeColor}
          />
        </View>

        {/* Categoria & Tiempo */}
        <View style={styles.headerInfoGroup}>
          <Text style={[styles.categoryLabel, { color: visualConfig.badgeColor }]}>
            {visualConfig.categoryLabel}
          </Text>
          <Text style={styles.timeText}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
      </View>

      {/* Contenido con textos aumentados */}
      <View style={styles.cardBody}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>

      {/* Indicadores de Estado (Las acciones se responden dentro del modal) */}
      {isPendingAction ? (
        <View style={styles.actionPromptBadge}>
          <View style={styles.actionPromptLeft}>
            <WinnixIcon name='time-outline' size={15} color={Colors.brand_primary} />
            <Text style={styles.actionPromptText}>
              Requiere respuesta · Toca para responder
            </Text>
          </View>
          <WinnixIcon name='chevron-forward' size={16} color={Colors.brand_primary} />
        </View>
      ) : item.actionStatus === 'ACCEPTED' ? (
        <View style={styles.statusBadgeAccepted}>
          <WinnixIcon name='checkmark-circle' size={15} color={Colors.green_500} />
          <Text style={styles.statusBadgeAcceptedText}>Solicitud Aceptada</Text>
        </View>
      ) : item.actionStatus === 'REJECTED' ? (
        <View style={styles.statusBadgeRejected}>
          <WinnixIcon name='close-circle' size={15} color={Colors.red_500} />
          <Text style={styles.statusBadgeRejectedText}>Solicitud Rechazada</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.surface_base,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    position: 'relative',
  },
  cardUnread: {
    backgroundColor: 'rgba(24, 34, 62, 0.98)',
    borderColor: 'rgba(40, 209, 195, 0.4)',
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: Colors.brand_primary,
    zIndex: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  badgeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfoGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 14,
  },
  categoryLabel: {
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 12,
    color: Colors.text_secondary,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  cardBody: {
    gap: 6,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 23,
    letterSpacing: 0.2,
  },
  messageText: {
    fontSize: 14.5,
    color: '#CBD5E1',
    lineHeight: 21,
  },
  actionPromptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(40, 209, 195, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.2)',
  },
  actionPromptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionPromptText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.brand_primary,
  },
  statusBadgeAccepted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
  },
  statusBadgeAcceptedText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.green_400,
  },
  statusBadgeRejected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
  },
  statusBadgeRejectedText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.red_500,
  },
});
