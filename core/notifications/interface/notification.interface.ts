export type NotificationType =
  // Torneos
  | 'TOURNAMENT_TEAM_JOIN_REQUEST'
  | 'TOURNAMENT_PLAYER_JOIN_REQUEST'
  | 'TOURNAMENT_PLAYER_EXPELLED'
  | 'TOURNAMENT_STAGE_STARTED'
  | 'TOURNAMENT_WINNER'
  // Equipos
  | 'TEAM_JOIN_REQUEST'
  | 'TEAM_INVITATION'
  | 'TEAM_PLAYER_JOINED'
  | 'TEAM_PLAYER_REMOVED'
  // Partidos
  | 'MATCH_STARTING_SOON'
  | 'MATCH_RESULT_CONFIRMED'
  | 'MATCH_SCHEDULE_UPDATED'
  // Sistema
  | 'SYSTEM_ALERT'
  | 'WELCOME';

export type NotificationCategory = 'ALL' | 'TOURNAMENTS' | 'TEAMS' | 'MATCHES' | 'SYSTEM';

export type NotificationActionStatus =
  | 'NONE'
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED';

export interface NotificationSender {
  _id: string;
  username?: string;
  nickname?: string;
  avatar?: string;
}

export interface NotificationItem {
  _id: string;
  recipient: string;
  sender?: NotificationSender | null;
  type: NotificationType;
  category: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  actionRequired: boolean;
  actionStatus: NotificationActionStatus;
  isRead: boolean;
  readAt?: string | null;
  deliveryChannels?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterNotificationParams {
  category?: string;
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface NotificationsListResponse {
  notifications: NotificationItem[];
  total: number;
  unreadCount: number;
}
