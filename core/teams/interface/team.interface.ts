export interface TeamCaptain {
  _id: string;
  username: string;
  nickname?: string;
  avatar?: string;
}

export interface TeamSport {
  _id: string;
  name: string;
  isActive: boolean;
}

export interface TeamGlobalStats {
  matchesPlayed: number;
  matchesWon: number;
  totalGoals: number;
  totalDraws: number;
  totalLost: number;
  titlesWon: number;
  winStreak: number;
}

export interface TeamMemberPlayer {
  _id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  position?: string;
  jerseyNumber?: number;
}

export interface TeamMemberStats {
  matchesPlayed: number;
  goals: number;
  yellowCards: number;
  redCards: number;
  blueCards: number;
}

export interface TeamMember {
  _id: string;
  team: string;
  player: TeamMemberPlayer;
  isActive: boolean;
  state: 'accepted' | 'pending' | 'rejected';
  invitationType?: 'INVITATION' | 'JOIN_REQUEST';
  joinedAt?: string;
  playerGlobalStats?: TeamMemberStats;
}

export interface Team {
  _id: string;
  name: string;
  logo?: string;
  captain: TeamCaptain;
  sport: TeamSport;
  isFavorite?: boolean;
  globalStats?: TeamGlobalStats;
  isActive: boolean;
  playersCount?: number;
  players?: TeamMember[];
  membershipStatus?: 'accepted' | 'pending' | 'rejected';
  invitationType?: 'INVITATION' | 'JOIN_REQUEST';
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamFormData {
  name: string;
  sport: string;
  logo?: string;
  isFavorite?: boolean;
}
