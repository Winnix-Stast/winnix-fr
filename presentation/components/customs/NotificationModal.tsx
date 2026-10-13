import React from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { NOTIFICATION_TYPE_CONFIG } from '@/core/notifications/constants/notifications-config';
import { NotificationItem } from '@/core/notifications/interface/notification.interface';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';

export interface NotificationModalProps {
  visible: boolean;
  item: NotificationItem | null;
  onClose: () => void;
  onRespondAction: (id: string, action: 'ACCEPT' | 'REJECT') => void;
  isSubmittingAction?: boolean;
}

/**
 * Modal Custom para Notificaciones
 * Reutilizable, responsivo para móviles, tablets y web.
 */
export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  item,
  onClose,
  onRespondAction,
  isSubmittingAction = false,
}) => {
  const router = useRouter();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  if (!item) return null;

  const modalWidth = Math.min(520, windowWidth * 0.92);

  const visualConfig =
    NOTIFICATION_TYPE_CONFIG[item.type] || NOTIFICATION_TYPE_CONFIG.SYSTEM_ALERT;

  const targetRoute = visualConfig.defaultRoute?.(item.data);

  const handleNavigate = () => {
    onClose();
    if (targetRoute) {
      router.push(targetRoute as any);
    }
  };

  const isPendingAction =
    item.actionRequired &&
    (item.actionStatus === 'PENDING' || item.actionStatus === 'NONE');

  const getActionTargetLabel = (): string => {
    if (item.category === 'TOURNAMENTS') return 'Ver Torneo';
    if (item.category === 'TEAMS') return 'Ver Equipo';
    if (item.category === 'MATCHES') return 'Ver Calendario';
    return 'Abrir Sección';
  };

  const formattedDate = (() => {
    try {
      const d = new Date(item.createdAt);
      return d.toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  })();

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <BlurView intensity={20} tint='dark' style={StyleSheet.absoluteFill} />
          <View style={styles.backdropDimmer} />

          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalCard,
                { width: modalWidth, maxHeight: windowHeight * 0.85 },
              ]}
            >
              <LinearGradient
                colors={['#0f1738', '#05091a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              {/* Encabezado */}
              <View style={styles.cardHeader}>
                <View style={styles.headerGroup}>
                  <View
                    style={[
                      styles.badgeCircle,
                      { backgroundColor: visualConfig.badgeBg },
                    ]}
                  >
                    <WinnixIcon
                      name={visualConfig.icon as any}
                      size={20}
                      color={visualConfig.badgeColor}
                    />
                  </View>
                  <Text
                    style={[styles.categoryTitle, { color: visualConfig.badgeColor }]}
                  >
                    {visualConfig.categoryLabel}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={styles.closeHeaderBtn}
                  activeOpacity={0.7}
                >
                  <WinnixIcon name='close' size={20} color={Colors.text_tertiary} />
                </TouchableOpacity>
              </View>

              {/* Contenido con scroll independiente */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                bounces={false}
              >
                {/* Fecha y Hora */}
                <Text style={styles.dateText}>{formattedDate}</Text>

                {/* Título de la Notificación */}
                <Text style={styles.titleText}>{item.title}</Text>

                {/* Mensaje descriptivo */}
                <Text style={styles.messageText}>{item.message}</Text>

                {/* Metadatos Contextuales */}
                {item.data && Object.keys(item.data).length > 0 && (
                  <View style={styles.metadataCard}>
                    {item.data.playerName && (
                      <View style={styles.metadataRow}>
                        <Text style={styles.metadataLabel}>Jugador:</Text>
                        <Text style={styles.metadataValue}>{item.data.playerName}</Text>
                      </View>
                    )}
                    {item.data.position && (
                      <View style={styles.metadataRow}>
                        <Text style={styles.metadataLabel}>Posición:</Text>
                        <Text style={styles.metadataValue}>{item.data.position}</Text>
                      </View>
                    )}
                    {item.data.field && (
                      <View style={styles.metadataRow}>
                        <Text style={styles.metadataLabel}>Cancha / Sede:</Text>
                        <Text style={styles.metadataValue}>{item.data.field}</Text>
                      </View>
                    )}
                    {item.data.time && (
                      <View style={styles.metadataRow}>
                        <Text style={styles.metadataLabel}>Hora:</Text>
                        <Text style={styles.metadataValue}>{item.data.time}</Text>
                      </View>
                    )}
                    {item.data.editionName && (
                      <View style={styles.metadataRow}>
                        <Text style={styles.metadataLabel}>Torneo:</Text>
                        <Text style={styles.metadataValue}>{item.data.editionName}</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Badges de Estado Resuelto */}
                {item.actionStatus === 'ACCEPTED' && (
                  <View style={styles.resolvedBadgeAccepted}>
                    <WinnixIcon
                      name='checkmark-circle'
                      size={18}
                      color={Colors.green_500}
                    />
                    <Text style={styles.resolvedTextAccepted}>Solicitud Aceptada</Text>
                  </View>
                )}
                {item.actionStatus === 'REJECTED' && (
                  <View style={styles.resolvedBadgeRejected}>
                    <WinnixIcon name='close-circle' size={18} color={Colors.red_500} />
                    <Text style={styles.resolvedTextRejected}>Solicitud Rechazada</Text>
                  </View>
                )}
              </ScrollView>

              {/* Botonera de Ancho Completo */}
              <View style={styles.cardFooter}>
                {isPendingAction && (
                  <TouchableOpacity
                    style={[styles.fullBtn, styles.acceptBtn]}
                    onPress={() => onRespondAction(item._id, 'ACCEPT')}
                    disabled={isSubmittingAction}
                    activeOpacity={0.82}
                  >
                    {isSubmittingAction ? (
                      <ActivityIndicator size='small' color='#030819' />
                    ) : (
                      <Text style={styles.acceptBtnText}>
                        {visualConfig.acceptLabel || 'Aceptar'}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}

                {isPendingAction && (
                  <TouchableOpacity
                    style={[styles.fullBtn, styles.rejectBtn]}
                    onPress={() => onRespondAction(item._id, 'REJECT')}
                    disabled={isSubmittingAction}
                    activeOpacity={0.82}
                  >
                    <Text style={styles.rejectBtnText}>
                      {visualConfig.rejectLabel || 'Rechazar'}
                    </Text>
                  </TouchableOpacity>
                )}

                {targetRoute && !isPendingAction && (
                  <TouchableOpacity
                    style={[styles.fullBtn, styles.navigateBtn]}
                    onPress={handleNavigate}
                    activeOpacity={0.82}
                  >
                    <WinnixIcon
                      name='arrow-forward-circle-outline'
                      size={22}
                      color={Colors.brand_primary}
                    />
                    <Text style={styles.navigateBtnText}>{getActionTargetLabel()}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.fullBtn, styles.closeBtn]}
                  onPress={onClose}
                  activeOpacity={0.75}
                >
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(2, 6, 20, 0.85)',
  },
  backdropDimmer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(2, 6, 20, 0.85)',
  },
  modalCard: {
    backgroundColor: '#0c122c',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },
  headerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  closeHeaderBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingVertical: 14,
  },
  dateText: {
    fontSize: 13,
    color: Colors.text_secondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 28,
    letterSpacing: 0.3,
  },
  messageText: {
    fontSize: 15.5,
    color: '#CBD5E1',
    lineHeight: 23,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  metadataCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 10,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metadataLabel: {
    fontSize: 14,
    color: Colors.text_tertiary,
    fontWeight: '700',
  },
  metadataValue: {
    fontSize: 15.5,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  resolvedBadgeAccepted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.25)',
  },
  resolvedTextAccepted: {
    color: Colors.green_400,
    fontSize: 14,
    fontWeight: '900',
  },
  resolvedBadgeRejected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  resolvedTextRejected: {
    color: Colors.red_500,
    fontSize: 14,
    fontWeight: '900',
  },
  cardFooter: {
    width: '100%',
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.07)',
  },
  fullBtn: {
    width: '100%',
    minHeight: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    backgroundColor: Colors.brand_primary,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  acceptBtnText: {
    color: '#030819',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  rejectBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  rejectBtnText: {
    color: Colors.red_500,
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  navigateBtn: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(40, 209, 195, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(40, 209, 195, 0.35)',
  },
  navigateBtnText: {
    color: Colors.brand_primary,
    fontSize: 15.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  closeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    minHeight: 46,
  },
  closeBtnText: {
    color: '#E2E8F0',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
