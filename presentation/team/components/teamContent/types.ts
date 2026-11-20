export interface TeamContentProps {
  team: any;
  activeTab: string;
  router: any;
  isEditing?: boolean;
  isCaptain?: boolean;
  refresh?: () => void;
  // Members Pagination
  members: any[];
  loadingMembers?: boolean;
  fetchNextMembersPage: () => void;
  hasNextMembersPage: boolean;
  isFetchingNextMembersPage: boolean;
  toggleMemberStatus: (playerId: string, isActive: boolean) => void;
  isTogglingMember: boolean;
}

export interface SectionTitleProps {
  title: string;
  icon: any;
}

export interface StatCardProps {
  label: string;
  value: any;
  icon: any;
  color: string;
  delay: number;
  fullWidth?: boolean;
  isHighlight?: boolean;
}

export interface PlayerCardProps {
  player: any;
  stats?: any;
  index: number;
  onPress: () => void;
  isEditing?: boolean;
  isCaptain?: boolean;
  isActive: boolean;
  state?: string;
  invitationType?: 'INVITATION' | 'JOIN_REQUEST';
  isMe?: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  isToggling?: boolean;
}
