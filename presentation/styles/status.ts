import { IconName } from '@/presentation/plugins/Icon';
import { Colors } from './colors';

export interface TournamentStatusStyle {
  label: string;
  iconName: IconName;
  iconColor: string;
  iconBgColor: string;
  statsCardColors: [string, string];
  statsCardBorderColor: string;
  statsCardTextColor: string;
  headerTextColor: string;
  headerBgColor: string;
  headerBorderColor: string;
  color: string;
}

export const TOURNAMENT_STATUS_CONFIG: Record<string, TournamentStatusStyle> = {
  DRAFT: {
    label: 'Próximamente',
    iconName: 'hourglass-outline',
    iconColor: Colors.status_draft,
    iconBgColor: Colors.status_draft_bg,
    statsCardColors: [Colors.status_draft_grad_start, Colors.status_draft_grad_end],
    statsCardBorderColor: Colors.status_draft_border,
    statsCardTextColor: Colors.status_draft,
    headerTextColor: Colors.status_draft,
    headerBgColor: 'rgba(3, 8, 25, 0.8)',
    headerBorderColor: Colors.status_draft,
    color: Colors.status_draft,
  },
  REGISTRATION_OPEN: {
    label: 'Inscripciones Abiertas',
    iconName: 'person-add-outline',
    iconColor: Colors.status_reg_open,
    iconBgColor: Colors.status_reg_open_bg,
    statsCardColors: [Colors.status_reg_open_grad_start, Colors.status_reg_open_grad_end],
    statsCardBorderColor: Colors.status_reg_open_border,
    statsCardTextColor: Colors.status_reg_open,
    headerTextColor: Colors.on_brand,
    headerBgColor: Colors.brand_primary,
    headerBorderColor: Colors.brand_primary,
    color: Colors.status_reg_open,
  },
  ACTIVE: {
    label: 'En curso',
    iconName: 'play-circle-outline',
    iconColor: Colors.status_active,
    iconBgColor: Colors.status_active_bg,
    statsCardColors: [Colors.status_active_grad_start, Colors.status_active_grad_end],
    statsCardBorderColor: Colors.status_active_border,
    statsCardTextColor: Colors.status_active,
    headerTextColor: Colors.text_primary,
    headerBgColor: Colors.brand_secondary,
    headerBorderColor: Colors.brand_secondary,
    color: Colors.status_active,
  },
  FINISHED: {
    label: 'Finalizado',
    iconName: 'trophy-outline',
    iconColor: Colors.status_finished,
    iconBgColor: Colors.status_finished_bg,
    statsCardColors: [Colors.status_finished_grad_start, Colors.status_finished_grad_end],
    statsCardBorderColor: Colors.status_finished_border,
    statsCardTextColor: Colors.status_finished,
    headerTextColor: Colors.text_primary,
    headerBgColor: Colors.text_tertiary,
    headerBorderColor: Colors.text_tertiary,
    color: Colors.status_finished,
  },
  CANCELLED: {
    label: 'Cancelado',
    iconName: 'close-circle-outline',
    iconColor: Colors.status_cancelled,
    iconBgColor: Colors.status_cancelled_bg,
    statsCardColors: [
      Colors.status_cancelled_grad_start,
      Colors.status_cancelled_grad_end,
    ],
    statsCardBorderColor: Colors.status_cancelled_border,
    statsCardTextColor: Colors.status_cancelled,
    headerTextColor: Colors.text_primary,
    headerBgColor: Colors.status_cancelled,
    headerBorderColor: Colors.status_cancelled,
    color: Colors.status_cancelled,
  },
};

const statusAlias: Record<string, string> = {
  PUBLISHED: 'REGISTRATION_OPEN',
  IN_PROGRESS: 'ACTIVE',
};

export const getTournamentStatusConfig = (status: string): TournamentStatusStyle => {
  if (!status) return TOURNAMENT_STATUS_CONFIG.DRAFT;
  let normalized = status.toUpperCase().trim();
  if (statusAlias[normalized]) {
    normalized = statusAlias[normalized];
  }
  return TOURNAMENT_STATUS_CONFIG[normalized] || TOURNAMENT_STATUS_CONFIG.DRAFT;
};
