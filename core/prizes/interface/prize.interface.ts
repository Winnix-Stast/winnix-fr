export interface Prize {
  _id: string;
  tournamentEdition: string;
  label: string;
  reward?: string;
  cashAmount?: number | null;
  currency?: string;
  additionalItems?: string[];
  position?: number | null;
  isMainPrize?: boolean;
  icon?: string;
  order?: number;
}

export interface CreatePrizePayload {
  tournamentEdition: string;
  label: string;
  reward?: string;
  cashAmount?: number | null;
  currency?: string;
  additionalItems?: string[];
  position?: number | null;
  isMainPrize?: boolean;
  icon?: string;
  order?: number;
}

export interface PrizeTheme {
  tagTitle: string;
  defaultLabel: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  gradColors: readonly [string, string];
  iconName: string;
}
