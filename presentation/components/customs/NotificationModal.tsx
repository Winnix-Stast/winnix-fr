import { NOTIFICATION_TYPE_CONFIG } from '@/core/notifications/constants/notifications-config';
import { NotificationItem } from '@/core/notifications/interface/notification.interface';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';

export interface NotificationModalProps {
  visible: boolean;
  item: NotificationItem | null;
  onClose: () => void;
  onRespondAction: (id: string, action: 'ACCEPT' | 'REJECT') => void;
  isSubmittingAction?: boolean;
}

// Estructura de la Entidad Principal del Evento (Spotlight)
interface SpotlightEntity {
  name: string;
  badge?: string;
  subtitle?: string;
  avatarUrl?: string;
  icon: string;
  contextTag?: string;
}

// Estructura de Metadato Dinámico Clave-Valor
interface DynamicAttribute {
  key: string;
  label: string;
  value: string;
  icon: string;
}

// Diccionario semántico de etiquetas e iconos para atributos del campo mixto
const ATTRIBUTE_METADATA_CONFIG: Record<
  string,
  { label: string; icon: string }
> = {
  field: { label: 'Cancha / Sede', icon: 'location-outline' },
  cancha: { label: 'Cancha / Sede', icon: 'location-outline' },
  venue: { label: 'Sede Oficial', icon: 'location-outline' },
  time: { label: 'Hora', icon: 'time-outline' },
  hora: { label: 'Hora', icon: 'time-outline' },
  date: { label: 'Fecha', icon: 'calendar-outline' },
  fecha: { label: 'Fecha', icon: 'calendar-outline' },
  score: { label: 'Marcador', icon: 'stats-chart-outline' },
  marcador: { label: 'Marcador', icon: 'stats-chart-outline' },
  position: { label: 'Posición', icon: 'shirt-outline' },
  posicion: { label: 'Posición', icon: 'shirt-outline' },
  sport: { label: 'Deporte', icon: 'football-outline' },
  sportName: { label: 'Deporte', icon: 'football-outline' },
  category: { label: 'Categoría', icon: 'ribbon-outline' },
  stage: { label: 'Fase', icon: 'flag-outline' },
  stageName: { label: 'Fase', icon: 'flag-outline' },
  editionName: { label: 'Torneo', icon: 'trophy-outline' },
  tournamentName: { label: 'Torneo', icon: 'trophy-outline' },
  teamName: { label: 'Equipo', icon: 'shield-outline' },
  amount: { label: 'Monto / Premio', icon: 'cash-outline' },
  prize: { label: 'Premio', icon: 'medal-outline' },
  reason: { label: 'Motivo', icon: 'information-circle-outline' },
};

// Claves técnicas internas que se excluyen de la visualización genérica
const TECHNICAL_KEYS = new Set([
  'teamId',
  'playerId',
  'tournamentId',
  'editionId',
  'matchId',
  'stageId',
  'prizeId',
  '_id',
  'id',
  '__v',
  'welcome',
  'actionRequired',
  'actionStatus',
  'deliveryChannels',
  'pushToken',
  'whatsappDeliveryMetadata',
]);

/**
 * Modal Custom para Notificaciones (Data-Driven y Polimórfico)
 * Sin estructuras rígidas if/else: renderiza dinámicamente según los datos de la notificación.
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

  const modalWidth = Math.min(520, windowWidth * 0.92);

  const visualConfig = item
    ? NOTIFICATION_TYPE_CONFIG[item.type] || NOTIFICATION_TYPE_CONFIG.SYSTEM_ALERT
    : NOTIFICATION_TYPE_CONFIG.SYSTEM_ALERT;

  const targetRoute = item ? visualConfig.defaultRoute?.(item.data) : null;

  // 1. Detección Inteligente y Dinámica de la Entidad Principal (Spotlight)
  const spotlightEntity = useMemo<SpotlightEntity | null>(() => {
    if (!item) return null;
    const data = item.data || {};

    // Nombre principal: Jugador > Equipo > Torneo > Remitente
    const entityName =
      data.playerName ||
      data.userName ||
      data.teamName ||
      data.tournamentName ||
      item.sender?.nickname ||
      item.sender?.username;

    if (!entityName) return null;

    // Avatar o logo
    const avatarUrl =
      data.playerAvatar ||
      data.avatar ||
      data.teamLogo ||
      data.logo ||
      data.tournamentLogo ||
      item.sender?.avatar;

    // Subtítulo descriptivo (email, deporte, nombre de usuario)
    const subtitle =
      data.playerEmail ||
      data.userEmail ||
      data.email ||
      data.sport ||
      data.sportName ||
      (item.sender?.username && item.sender.username !== entityName
        ? `@${item.sender.username}`
        : undefined);

    // Contexto relacional (ej. a qué escuadra o torneo se vincula la solicitud)
    let contextTag: string | undefined;
    if (data.playerName && data.teamName) {
      contextTag = `Escuadra: ${data.teamName}`;
    } else if (data.teamName && (data.tournamentName || data.editionName)) {
      contextTag = `Torneo: ${data.tournamentName || data.editionName}`;
    }

    // Badge contextual
    const badge =
      data.role ||
      (item.actionRequired
        ? item.category === 'TEAMS'
          ? 'ASPIRANTE'
          : 'SOLICITANTE'
        : undefined);

    // Icono según tipo de entidad
    const icon = data.playerName || item.sender
      ? 'person'
      : data.teamName
        ? 'shield'
        : 'trophy';

    return {
      name: entityName,
      badge,
      subtitle,
      avatarUrl,
      icon,
      contextTag,
    };
  }, [item]);

  // 2. Extracción Dinámica de Atributos del Campo Mixto
  const dynamicAttributes = useMemo<DynamicAttribute[]>(() => {
    if (!item?.data) return [];
    const data = item.data;

    // Claves ya absorbidas por el Spotlight para no duplicar en la lista
    const spotlightConsumedKeys = new Set([
      'playerName',
      'playerNickname',
      'playerUsername',
      'playerAvatar',
      'playerEmail',
      'playerPhone',
      'avatar',
      'logo',
      'teamLogo',
      'tournamentLogo',
      'userName',
      'userEmail',
      ...(spotlightEntity?.name === data.teamName ? ['teamName'] : []),
      ...(spotlightEntity?.name === data.tournamentName ? ['tournamentName'] : []),
      ...(spotlightEntity?.contextTag?.includes(data.teamName) ? ['teamName'] : []),
      ...(spotlightEntity?.contextTag?.includes(data.tournamentName || data.editionName)
        ? ['tournamentName', 'editionName']
        : []),
    ]);

    const result: DynamicAttribute[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (
        TECHNICAL_KEYS.has(key) ||
        spotlightConsumedKeys.has(key) ||
        value === null ||
        value === undefined ||
        value === '' ||
        typeof value === 'object'
      ) {
        return;
      }

      const conf = ATTRIBUTE_METADATA_CONFIG[key] || {
        label: key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .trim(),
        icon: 'information-circle-outline',
      };

      result.push({
        key,
        label: conf.label,
        value: String(value),
        icon: conf.icon,
      });
    });

    return result;
  }, [item?.data, spotlightEntity]);

  // Mensaje enriquecido con el nombre real de la entidad si estaba genérico
  const displayMessage = useMemo(() => {
    if (!item) return '';
    if (
      item.message.startsWith('Un jugador') &&
      spotlightEntity?.name
    ) {
      return item.message.replace('Un jugador', spotlightEntity.name);
    }
    return item.message;
  }, [item, spotlightEntity?.name]);

  const handleNavigate = () => {
    onClose();
    if (targetRoute) {
      router.push(targetRoute as any);
    }
  };

  const isPendingAction =
    Boolean(item?.actionRequired) &&
    (item?.actionStatus === 'PENDING' || item?.actionStatus === 'NONE');

  const getActionTargetLabel = (): string => {
    if (item?.category === 'TOURNAMENTS') return 'Ver Torneo';
    if (item?.category === 'TEAMS') return 'Ver Equipo';
    if (item?.category === 'MATCHES') return 'Ver Calendario';
    return 'Abrir Sección';
  };

  const formattedDate = (() => {
    if (!item?.createdAt) return '';
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

  if (!item) return null;

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

                {/* Mensaje descriptivo con nombre resuelto */}
                <Text style={styles.messageText}>{displayMessage}</Text>

                {/* 1. Spotlight de Entidad Principal (100% dinámico y desacoplado) */}
                {spotlightEntity && (
                  <View style={styles.spotlightCard}>
                    <View style={styles.spotlightAvatarBox}>
                      {spotlightEntity.avatarUrl ? (
                        <Image
                          source={{ uri: spotlightEntity.avatarUrl }}
                          style={styles.spotlightAvatarImg}
                        />
                      ) : (
                        <View style={styles.spotlightAvatarPlaceholder}>
                          <WinnixIcon
                            name={spotlightEntity.icon as any}
                            size={22}
                            color={Colors.brand_primary}
                          />
                        </View>
                      )}
                    </View>

                    <View style={styles.spotlightInfo}>
                      <View style={styles.spotlightTitleRow}>
                        <Text style={styles.spotlightName} numberOfLines={1}>
                          {spotlightEntity.name}
                        </Text>
                        {spotlightEntity.badge && (
                          <View style={styles.spotlightBadgePill}>
                            <Text style={styles.spotlightBadgePillText}>
                              {spotlightEntity.badge}
                            </Text>
                          </View>
                        )}
                      </View>

                      {spotlightEntity.subtitle && (
                        <Text style={styles.spotlightSubtitle} numberOfLines={1}>
                          {spotlightEntity.subtitle}
                        </Text>
                      )}

                      {spotlightEntity.contextTag && (
                        <View style={styles.spotlightContextRow}>
                          <WinnixIcon
                            name='link-outline'
                            size={13}
                            color={Colors.brand_primary}
                          />
                          <Text style={styles.spotlightContextText} numberOfLines={1}>
                            {spotlightEntity.contextTag}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* 2. Grilla Dinámica de Atributos del Campo Mixto */}
                {
                  dynamicAttributes.length > 0 && (
                    <View style={styles.metadataCard}>
                      {dynamicAttributes.map((attr) => (
                        <View key={attr.key} style={styles.metadataRow}>
                          <View style={styles.metaLabelGroup}>
                            <WinnixIcon
                              name={attr.icon as any}
                              size={14}
                              color={Colors.text_tertiary}
                            />
                            <Text style={styles.metadataLabel}>{attr.label}:</Text>
                          </View>
                          <Text style={styles.metadataValue}>{attr.value}</Text>
                        </View>
                      ))}
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
      </TouchableWithoutFeedback >
    </Modal >
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
  spotlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 209, 195, 0.07)',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.22)',
    marginBottom: 12,
  },
  spotlightAvatarBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
  },
  spotlightAvatarImg: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  spotlightAvatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.35)',
  },
  spotlightInfo: {
    flex: 1,
    gap: 4,
  },
  spotlightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  spotlightName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    flex: 1,
  },
  spotlightBadgePill: {
    backgroundColor: 'rgba(40, 209, 195, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.35)',
  },
  spotlightBadgePillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: Colors.brand_primary,
    letterSpacing: 0.8,
  },
  spotlightSubtitle: {
    fontSize: 12.5,
    color: Colors.text_secondary,
    fontWeight: '600',
  },
  spotlightContextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  spotlightContextText: {
    fontSize: 13,
    color: Colors.text_secondary,
    fontWeight: '600',
    flex: 1,
  },
  metadataCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 14,
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
  metaLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metadataLabel: {
    fontSize: 13.5,
    color: Colors.text_tertiary,
    fontWeight: '700',
  },
  metadataValue: {
    fontSize: 14.5,
    color: '#FFFFFF',
    fontWeight: '800',
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
