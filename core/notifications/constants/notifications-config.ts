import { Colors } from '@/presentation/styles/colors';
import { NotificationType } from '../interface/notification.interface';

export interface NotificationVisualConfig {
  icon: string;
  badgeBg: string;
  badgeColor: string;
  accentBorder: string;
  categoryLabel: string;
  defaultRoute?: (data?: Record<string, any>) => string | null;
  acceptLabel?: string;
  rejectLabel?: string;
}

/**
 * Validador para asegurar que un ID es un ObjectId real de MongoDB y no un ID ficticio de prueba ('demo')
 */
const isValidEntityId = (id?: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  if (id.includes('demo')) return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationType,
  NotificationVisualConfig
> = {
  // === TORNEOS ===
  TOURNAMENT_TEAM_JOIN_REQUEST: {
    icon: 'trophy-outline',
    badgeBg: 'rgba(40, 209, 195, 0.15)',
    badgeColor: Colors.brand_primary,
    accentBorder: Colors.brand_primary,
    categoryLabel: 'Torneo',
    acceptLabel: 'Aprobar Equipo',
    rejectLabel: 'Rechazar',
    defaultRoute: (data) =>
      isValidEntityId(data?.tournamentId)
        ? `/winnix/tournament/${data?.tournamentId}`
        : null,
  },
  TOURNAMENT_PLAYER_JOIN_REQUEST: {
    icon: 'person-add-outline',
    badgeBg: 'rgba(40, 209, 195, 0.15)',
    badgeColor: Colors.brand_primary,
    accentBorder: Colors.brand_primary,
    categoryLabel: 'Inscripción',
    acceptLabel: 'Aceptar Jugador',
    rejectLabel: 'Rechazar',
    defaultRoute: (data) =>
      isValidEntityId(data?.tournamentId)
        ? `/winnix/tournament/${data?.tournamentId}`
        : null,
  },
  TOURNAMENT_PLAYER_EXPELLED: {
    icon: 'warning-outline',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    badgeColor: Colors.red_500,
    accentBorder: Colors.red_500,
    categoryLabel: 'Sanción',
    defaultRoute: (data) =>
      isValidEntityId(data?.tournamentId)
        ? `/winnix/tournament/${data?.tournamentId}`
        : null,
  },
  TOURNAMENT_STAGE_STARTED: {
    icon: 'flag-outline',
    badgeBg: 'rgba(251, 146, 60, 0.15)',
    badgeColor: Colors.orange_400,
    accentBorder: Colors.orange_400,
    categoryLabel: 'Nueva Fase',
    defaultRoute: (data) =>
      isValidEntityId(data?.tournamentId)
        ? `/winnix/tournament/${data?.tournamentId}`
        : null,
  },
  TOURNAMENT_WINNER: {
    icon: 'ribbon-outline',
    badgeBg: 'rgba(234, 179, 8, 0.15)',
    badgeColor: '#EAB308',
    accentBorder: '#EAB308',
    categoryLabel: 'Campeón',
    defaultRoute: (data) =>
      isValidEntityId(data?.tournamentId)
        ? `/winnix/tournament/${data?.tournamentId}`
        : null,
  },

  // === EQUIPOS ===
  TEAM_JOIN_REQUEST: {
    icon: 'people-outline',
    badgeBg: 'rgba(99, 102, 241, 0.15)',
    badgeColor: Colors.brand_secondary,
    accentBorder: Colors.brand_secondary,
    categoryLabel: 'Equipo',
    acceptLabel: 'Fichar Jugador',
    rejectLabel: 'Rechazar',
    defaultRoute: (data) =>
      isValidEntityId(data?.teamId) ? `/winnix/team/${data?.teamId}` : null,
  },
  TEAM_INVITATION: {
    icon: 'mail-unread-outline',
    badgeBg: 'rgba(99, 102, 241, 0.15)',
    badgeColor: Colors.brand_secondary,
    accentBorder: Colors.brand_secondary,
    categoryLabel: 'Invitación',
    acceptLabel: 'Unirme al Equipo',
    rejectLabel: 'Declinar',
    defaultRoute: (data) =>
      isValidEntityId(data?.teamId) ? `/winnix/team/${data?.teamId}` : null,
  },
  TEAM_PLAYER_JOINED: {
    icon: 'person-add-outline',
    badgeBg: 'rgba(34, 197, 94, 0.15)',
    badgeColor: Colors.green_500,
    accentBorder: Colors.green_500,
    categoryLabel: 'Nuevo Fichaje',
    defaultRoute: (data) =>
      isValidEntityId(data?.teamId) ? `/winnix/team/${data?.teamId}` : null,
  },
  TEAM_PLAYER_REMOVED: {
    icon: 'person-remove-outline',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    badgeColor: Colors.red_500,
    accentBorder: Colors.red_500,
    categoryLabel: 'Baja de Equipo',
    defaultRoute: (data) =>
      isValidEntityId(data?.teamId) ? `/winnix/team/${data?.teamId}` : null,
  },

  // === PARTIDOS ===
  MATCH_STARTING_SOON: {
    icon: 'time-outline',
    badgeBg: 'rgba(251, 146, 60, 0.15)',
    badgeColor: Colors.orange_400,
    accentBorder: Colors.orange_400,
    categoryLabel: 'Partido Próximo',
    defaultRoute: (data) =>
      isValidEntityId(data?.tournamentId)
        ? `/winnix/tournament/${data?.tournamentId}`
        : '/winnix/tabs/calendar',
  },
  MATCH_RESULT_CONFIRMED: {
    icon: 'checkmark-circle-outline',
    badgeBg: 'rgba(34, 197, 94, 0.15)',
    badgeColor: Colors.green_500,
    accentBorder: Colors.green_500,
    categoryLabel: 'Marcador Final',
    defaultRoute: (data) =>
      isValidEntityId(data?.tournamentId)
        ? `/winnix/tournament/${data?.tournamentId}`
        : '/winnix/tabs/calendar',
  },
  MATCH_SCHEDULE_UPDATED: {
    icon: 'calendar-outline',
    badgeBg: 'rgba(40, 209, 195, 0.15)',
    badgeColor: Colors.brand_primary,
    accentBorder: Colors.brand_primary,
    categoryLabel: 'Horario Modificado',
    defaultRoute: (data) =>
      isValidEntityId(data?.tournamentId)
        ? `/winnix/tournament/${data?.tournamentId}`
        : '/winnix/tabs/calendar',
  },

  // === SISTEMA ===
  SYSTEM_ALERT: {
    icon: 'notifications-outline',
    badgeBg: 'rgba(251, 146, 60, 0.15)',
    badgeColor: Colors.orange_400,
    accentBorder: Colors.orange_400,
    categoryLabel: 'Aviso Oficial',
  },
  WELCOME: {
    icon: 'sparkles-outline',
    badgeBg: 'rgba(40, 209, 195, 0.15)',
    badgeColor: Colors.brand_primary,
    accentBorder: Colors.brand_primary,
    categoryLabel: 'Bienvenida',
  },
};

export const NOTIFICATION_CATEGORY_FILTERS = [
  { id: 'ALL', label: 'Todas' },
  { id: 'TOURNAMENTS', label: 'Torneos' },
  { id: 'TEAMS', label: 'Equipos' },
  { id: 'MATCHES', label: 'Partidos' },
  { id: 'UNREAD', label: 'Sin leer' },
];
