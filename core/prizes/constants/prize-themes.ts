import { Colors } from '@/presentation/styles/colors';
import { PrizeTheme } from '../interface/prize.interface';

export const PREDEFINED_THEMES: Record<string, PrizeTheme> = {
  campeon: {
    tagTitle: '1° LUGAR',
    defaultLabel: 'Campeón del Torneo',
    accentColor: '#FBBF24',
    badgeBg: '#FBBF24',
    badgeText: '#000000',
    borderColor: 'rgba(251, 191, 36, 0.45)',
    gradColors: ['rgba(251, 191, 36, 0.16)', 'rgba(14, 21, 41, 0.95)'] as const,
    iconName: 'trophy',
  },
  subcampeon: {
    tagTitle: '2° LUGAR',
    defaultLabel: 'Subcampeón',
    accentColor: '#28D1C3',
    badgeBg: '#28D1C3',
    badgeText: '#000000',
    borderColor: 'rgba(40, 209, 195, 0.45)',
    gradColors: ['rgba(40, 209, 195, 0.16)', 'rgba(14, 21, 41, 0.95)'] as const,
    iconName: 'medal',
  },
  tercer: {
    tagTitle: '3° LUGAR',
    defaultLabel: 'Tercer Lugar',
    accentColor: '#F97316',
    badgeBg: '#F97316',
    badgeText: '#FFFFFF',
    borderColor: 'rgba(249, 115, 22, 0.45)',
    gradColors: ['rgba(249, 115, 22, 0.16)', 'rgba(14, 21, 41, 0.95)'] as const,
    iconName: 'ribbon',
  },
  cuarto: {
    tagTitle: '4° LUGAR',
    defaultLabel: 'Cuarto Lugar',
    accentColor: '#6366F1',
    badgeBg: '#6366F1',
    badgeText: '#FFFFFF',
    borderColor: 'rgba(99, 102, 241, 0.45)',
    gradColors: ['rgba(99, 102, 241, 0.16)', 'rgba(14, 21, 41, 0.95)'] as const,
    iconName: 'star',
  },
  goleador: {
    tagTitle: 'GOLEADOR',
    defaultLabel: 'Máximo Goleador',
    accentColor: '#22C55E',
    badgeBg: '#22C55E',
    badgeText: '#FFFFFF',
    borderColor: 'rgba(34, 197, 94, 0.45)',
    gradColors: ['rgba(34, 197, 94, 0.16)', 'rgba(14, 21, 41, 0.95)'] as const,
    iconName: 'football',
  },
  valla: {
    tagTitle: 'ARQUERO',
    defaultLabel: 'Valla Menos Vencida',
    accentColor: '#3B82F6',
    badgeBg: '#3B82F6',
    badgeText: '#FFFFFF',
    borderColor: 'rgba(59, 130, 246, 0.45)',
    gradColors: ['rgba(59, 130, 246, 0.16)', 'rgba(14, 21, 41, 0.95)'] as const,
    iconName: 'shield-checkmark',
  },
  mvp: {
    tagTitle: 'MEJOR JUGADOR',
    defaultLabel: 'Jugador MVP',
    accentColor: '#EC4899',
    badgeBg: '#EC4899',
    badgeText: '#FFFFFF',
    borderColor: 'rgba(236, 72, 153, 0.45)',
    gradColors: ['rgba(236, 72, 153, 0.16)', 'rgba(14, 21, 41, 0.95)'] as const,
    iconName: 'sparkles',
  },
  bono: {
    tagTitle: 'RECONOCIMIENTO',
    defaultLabel: 'Bono Especial',
    accentColor: '#EAB308',
    badgeBg: '#EAB308',
    badgeText: '#000000',
    borderColor: 'rgba(234, 179, 8, 0.45)',
    gradColors: ['rgba(234, 179, 8, 0.16)', 'rgba(14, 21, 41, 0.95)'] as const,
    iconName: 'ticket',
  },
  otro: {
    tagTitle: 'PERSONALIZADO',
    defaultLabel: 'Premio Personalizado',
    accentColor: Colors.brand_primary,
    badgeBg: Colors.brand_primary,
    badgeText: '#000000',
    borderColor: 'rgba(40, 209, 195, 0.45)',
    gradColors: ['rgba(40, 209, 195, 0.16)', 'rgba(14, 21, 41, 0.95)'] as const,
    iconName: 'create-outline',
  },
};

export const PRIZE_SUGGESTIONS = [
  {
    label: 'Campeón del Torneo',
    position: 1,
    themeKey: 'campeon',
    icon: 'trophy-outline' as const,
  },
  {
    label: 'Subcampeón',
    position: 2,
    themeKey: 'subcampeon',
    icon: 'medal-outline' as const,
  },
  {
    label: 'Tercer Lugar',
    position: 3,
    themeKey: 'tercer',
    icon: 'ribbon-outline' as const,
  },
  {
    label: 'Cuarto Lugar',
    position: 4,
    themeKey: 'cuarto',
    icon: 'star-outline' as const,
  },
  {
    label: 'Máximo Goleador',
    position: null,
    themeKey: 'goleador',
    icon: 'football-outline' as const,
  },
  {
    label: 'Valla Menos Vencida',
    position: null,
    themeKey: 'valla',
    icon: 'shield-checkmark-outline' as const,
  },
  {
    label: 'Jugador MVP',
    position: null,
    themeKey: 'mvp',
    icon: 'sparkles-outline' as const,
  },
  {
    label: 'Bono Especial',
    position: null,
    themeKey: 'bono',
    icon: 'ticket-outline' as const,
  },
  {
    label: 'Otro (Personalizado)',
    position: null,
    themeKey: 'otro',
    icon: 'create-outline' as const,
  },
];

export const getPrizeTheme = (prize: {
  label?: string;
  position?: number | null;
}): PrizeTheme => {
  const pos = prize.position;
  const label = (prize.label || '').toLowerCase();

  if (
    pos === 1 ||
    label.includes('campeón') ||
    label.includes('campeon') ||
    label.includes('1°') ||
    label.includes('primer')
  ) {
    return PREDEFINED_THEMES.campeon;
  }
  if (
    pos === 2 ||
    label.includes('subcampeón') ||
    label.includes('subcampeon') ||
    label.includes('2°') ||
    label.includes('segundo')
  ) {
    return PREDEFINED_THEMES.subcampeon;
  }
  if (pos === 3 || label.includes('tercer') || label.includes('3°')) {
    return PREDEFINED_THEMES.tercer;
  }
  if (pos === 4 || label.includes('cuarto') || label.includes('4°')) {
    return PREDEFINED_THEMES.cuarto;
  }
  if (label.includes('goleador') || label.includes('goles') || label.includes('pichi')) {
    return PREDEFINED_THEMES.goleador;
  }
  if (label.includes('valla') || label.includes('arquero') || label.includes('portero')) {
    return PREDEFINED_THEMES.valla;
  }
  if (label.includes('mvp') || label.includes('mejor') || label.includes('destacado')) {
    return PREDEFINED_THEMES.mvp;
  }
  if (label.includes('bono') || label.includes('premio') || label.includes('extra')) {
    return PREDEFINED_THEMES.bono;
  }

  if (pos) {
    return {
      tagTitle: `${pos}° LUGAR`,
      defaultLabel: `Posición ${pos}`,
      accentColor: '#6366F1',
      badgeBg: '#6366F1',
      badgeText: '#FFFFFF',
      borderColor: 'rgba(99, 102, 241, 0.45)',
      gradColors: ['rgba(99, 102, 241, 0.16)', 'rgba(14, 21, 41, 0.95)'] as const,
      iconName: 'star',
    };
  }

  return {
    tagTitle: 'PREMIO',
    defaultLabel: prize.label || 'Reconocimiento',
    accentColor: Colors.brand_primary,
    badgeBg: Colors.brand_primary,
    badgeText: '#000000',
    borderColor: 'rgba(40, 209, 195, 0.45)',
    gradColors: ['rgba(40, 209, 195, 0.16)', 'rgba(14, 21, 41, 0.95)'] as const,
    iconName: 'sparkles',
  };
};
