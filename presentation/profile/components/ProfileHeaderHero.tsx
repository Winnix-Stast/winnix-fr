import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from '@/core/auth/interface/user';
import { UserProfile } from '@/core/profile/interface/profile.interface';
import { ProfileRoleTab } from '@/presentation/hooks/profile/useProfile';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';

interface Props {
  user: User | UserProfile | null | undefined;
  uniqueCode: string;
  likes: number;
  hasLiked: boolean;
  copiedCode: boolean;
  onToggleLike: () => void;
  onCopyCode: () => void;
  activeTab?: ProfileRoleTab;
  brandsCount?: number;
  editionsCount?: number;
  inscriptionsCount?: number;
  isOwnProfile?: boolean;
  onBack?: () => void;
}

interface RoleHeroDisplayConfig {
  roleName: string;
  icon: any;
  ringColors: [string, string];
  statusIcon: any;
  leftBubble: {
    label: string;
    labelColor: string;
    borderColor: string;
    value: string | number;
    sub: string;
  };
  rightBubble: {
    label: string;
    labelColor: string;
    borderColor: string;
    value: string | number;
    sub: string;
  };
  subtitleText: string;
}

const getHeroConfigForRole = (
  role: ProfileRoleTab,
  user: User | UserProfile | null | undefined,
  counts: { brandsCount: number; editionsCount: number; inscriptionsCount: number },
  locationText: string,
): RoleHeroDisplayConfig => {
  const anyUser = user as any;

  switch (role) {
    case 'organizador':
      return {
        roleName: 'Organizador',
        icon: 'briefcase',
        ringColors: [Colors.orange_400, Colors.brand_primary],
        statusIcon: 'checkmark-circle',
        leftBubble: {
          label: 'MARCAS',
          labelColor: Colors.brand_primary,
          borderColor: Colors.orange_400,
          value: counts.brandsCount,
          sub: 'ACTIVAS',
        },
        rightBubble: {
          label: 'EDICIONES',
          labelColor: Colors.orange_400,
          borderColor: Colors.brand_primary,
          value: counts.editionsCount,
          sub: 'TORNEOS',
        },
        subtitleText: `Organizador • ${locationText || 'Winnix Platform'}`,
      };

    case 'juez':
      return {
        roleName: 'Árbitro / Juez',
        icon: 'ribbon-outline',
        ringColors: [Colors.brand_primary, Colors.orange_400],
        statusIcon: 'shield-checkmark',
        leftBubble: {
          label: 'PARTIDOS',
          labelColor: Colors.brand_primary,
          borderColor: Colors.brand_primary,
          value:
            anyUser?.matchesJudged ?? anyUser?.matchesCount ?? anyUser?.matches ?? '--',
          sub: 'DIRIGIDOS',
        },
        rightBubble: {
          label: 'TORNEOS',
          labelColor: Colors.orange_400,
          borderColor: Colors.orange_400,
          value:
            (anyUser?.tournamentsCount ?? anyUser?.tournaments ?? counts.editionsCount) ||
            '--',
          sub: 'OFICIALES',
        },
        subtitleText: `Árbitro / Juez • ${locationText || 'Winnix Officiating'}`,
      };

    case 'dt':
      return {
        roleName: 'Director Técnico',
        icon: 'clipboard-outline',
        ringColors: [Colors.brand_primary, Colors.orange_400],
        statusIcon: 'star',
        leftBubble: {
          label: 'EQUIPOS',
          labelColor: Colors.brand_primary,
          borderColor: Colors.brand_primary,
          value: anyUser?.teamsCount ?? anyUser?.teamsManaged ?? '--',
          sub: 'DIRIGIDOS',
        },
        rightBubble: {
          label: 'TORNEOS',
          labelColor: Colors.orange_400,
          borderColor: Colors.orange_400,
          value: (anyUser?.tournamentsCount ?? counts.editionsCount) || '--',
          sub: 'COMPETIDOS',
        },
        subtitleText: `Director Técnico • ${locationText || 'Winnix Staff'}`,
      };

    case 'carrera':
    default: {
      const hasRatingOrOvr = anyUser?.ovr || anyUser?.rating;
      const position = anyUser?.preferredPosition || anyUser?.position || 'DEPORTISTA';
      return {
        roleName: 'Jugador',
        icon: 'football-outline',
        ringColors: [Colors.brand_primary, Colors.orange_400],
        statusIcon: 'flash',
        leftBubble: {
          label: hasRatingOrOvr ? 'OVR' : 'POSICIÓN',
          labelColor: Colors.orange_400,
          borderColor: Colors.brand_primary,
          value: anyUser?.ovr || anyUser?.rating || position,
          sub: hasRatingOrOvr ? position : 'PRINCIPAL',
        },
        rightBubble: {
          label: 'INSCRIP.',
          labelColor: Colors.brand_primary,
          borderColor: Colors.orange_400,
          value: counts.inscriptionsCount,
          sub: 'JUGADAS',
        },
        subtitleText: `Jugador • ${locationText || 'Winnix League'}`,
      };
    }
  }
};

export const ProfileHeaderHero: React.FC<Props> = ({
  user,
  uniqueCode,
  likes,
  hasLiked,
  copiedCode,
  onToggleLike,
  onCopyCode,
  activeTab = 'organizador',
  brandsCount = 0,
  editionsCount = 0,
  inscriptionsCount = 0,
  isOwnProfile = true,
  onBack,
}) => {
  const nickname =
    user?.nickname ||
    user?.username ||
    (user?.email ? user.email.split('@')[0] : 'USUARIO WINNIX');

  const locationText = [user?.city, user?.country].filter(Boolean).join(', ');

  // Dynamic configuration resolved for the active role tab
  const heroConfig = getHeroConfigForRole(
    activeTab,
    user,
    { brandsCount, editionsCount, inscriptionsCount },
    locationText,
  );

  // Format user roles into human readable list for public presentation card
  const rawRoles = (user?.roles || []).map((r: any) =>
    typeof r === 'object'
      ? String(r?.name || r?.label || '').toUpperCase()
      : String(r).toUpperCase(),
  );

  const userRolesList: string[] = [];
  if (rawRoles.includes('ORGANIZER') || rawRoles.includes('ORGANIZADOR'))
    userRolesList.push('Organizador');
  if (
    rawRoles.includes('PLAYER') ||
    rawRoles.includes('JUGADOR') ||
    rawRoles.includes('DEPORTISTA')
  )
    userRolesList.push('Jugador');
  if (
    rawRoles.includes('JUDGE') ||
    rawRoles.includes('JUEZ') ||
    rawRoles.includes('ARBITRO')
  )
    userRolesList.push('Árbitro / Juez');
  if (
    rawRoles.includes('DT') ||
    rawRoles.includes('COACH') ||
    rawRoles.includes('DIRECTOR_TECNICO')
  )
    userRolesList.push('Director Técnico');

  if (userRolesList.length === 0) {
    userRolesList.push(heroConfig.roleName || 'Usuario Winnix');
  }

  // Get user initials for circular avatar fallback
  const getInitials = () => {
    if (user?.nickname) {
      const parts = user.nickname.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return user.nickname.substring(0, 2).toUpperCase();
    }
    if (user?.username) return user.username.substring(0, 2).toUpperCase();
    if (user?.email) return user.email.substring(0, 2).toUpperCase();
    return 'WX';
  };

  return (
    <View style={styles.container}>
      {/* Top Header inside Hero */}
      <View style={styles.topNavHeader}>
        <View style={styles.topNavLeftGroup}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <WinnixIcon name='arrow-back' size={20} color={Colors.text_primary} />
            </TouchableOpacity>
          )}
          <Text style={styles.profileTitleText}>
            {isOwnProfile ? 'MI PERFIL' : 'PERFIL'}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onCopyCode}
          style={[styles.uniqueCodeBadge, copiedCode && styles.copiedBadge]}
        >
          <WinnixIcon
            name={copiedCode ? 'checkmark-circle' : 'finger-print-outline'}
            size={14}
            color={Colors.surface_base}
          />
          <Text style={styles.uniqueCodeText}>{copiedCode ? 'COPIADO' : uniqueCode}</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section (Tall vertical hero card matching sports card presentation) */}
      <View style={styles.heroWrapper}>
        <LinearGradient
          colors={['rgba(14, 21, 41, 0.95)', 'rgba(8, 12, 26, 0.98)']}
          style={[
            styles.heroCardBackdrop,
            user?.avatar ? styles.heroCardBackdropPortrait : null,
          ]}
        >
          {/* Central Hero Avatar Display */}
          {user?.avatar ? (
            <View style={styles.portraitAvatarContainer}>
              <Image
                source={{ uri: user.avatar }}
                style={styles.portraitAvatarImage}
                resizeMode='cover'
              />
            </View>
          ) : (
            /* Fallback Circular Avatar if no photo */
            <View style={styles.avatarCentralWrapper}>
              <LinearGradient
                colors={heroConfig.ringColors}
                style={styles.avatarGradientRing}
              >
                <View style={styles.avatarInnerContainer}>
                  <View style={styles.avatarFallbackContainer}>
                    <Text style={styles.avatarInitials}>{getInitials()}</Text>
                  </View>
                </View>
              </LinearGradient>
              <View style={styles.avatarStatusBadge}>
                <WinnixIcon
                  name={heroConfig.statusIcon}
                  size={14}
                  color={Colors.surface_base}
                />
              </View>
            </View>
          )}
        </LinearGradient>

        {/* Floating Overhanging Left Bubble */}
        <View
          style={[
            styles.floatingBubble,
            user?.avatar ? styles.portraitFloatingBubbleLeft : styles.leftBubble,
            { borderColor: heroConfig.leftBubble.borderColor },
          ]}
        >
          <Text style={[styles.bubbleLabel, { color: heroConfig.leftBubble.labelColor }]}>
            {heroConfig.leftBubble.label}
          </Text>
          <Text style={styles.bubbleValue}>{heroConfig.leftBubble.value}</Text>
          <Text style={styles.bubbleSub}>{heroConfig.leftBubble.sub}</Text>
        </View>

        {/* Floating Overhanging Right Bubble */}
        <View
          style={[
            styles.floatingBubble,
            user?.avatar ? styles.portraitFloatingBubbleRight : styles.rightBubble,
            { borderColor: heroConfig.rightBubble.borderColor },
          ]}
        >
          <Text
            style={[styles.bubbleLabel, { color: heroConfig.rightBubble.labelColor }]}
          >
            {heroConfig.rightBubble.label}
          </Text>
          <Text style={styles.bubbleValue}>{heroConfig.rightBubble.value}</Text>
          <Text style={styles.bubbleSub}>{heroConfig.rightBubble.sub}</Text>
        </View>
      </View>

      {/* Floating Info Section - Dynamic and Unburned */}
      <View style={styles.floatingInfoSection}>
        <View style={styles.nameRow}>
          <Text style={styles.gamertag} numberOfLines={1}>
            {nickname}
          </Text>
        </View>

        <View style={styles.subtitleRow}>
          <WinnixIcon name={heroConfig.icon} size={15} color={Colors.brand_primary} />
          <Text style={styles.subtitleText}>{heroConfig.subtitleText}</Text>
        </View>

        {/* Dynamic User Roles Attribute Chips */}
        <View style={styles.chipsRow}>
          {userRolesList.map((roleLabel, idx) => (
            <View key={idx} style={[styles.chip, styles.roleChip]}>
              <Text style={styles.roleChipText}>{roleLabel}</Text>
            </View>
          ))}

          <View style={[styles.chip, styles.activeChip]}>
            <Text style={styles.activeChipText}>Activo</Text>
          </View>

          {user?.email ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>Verificado</Text>
            </View>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onToggleLike}
            style={[styles.likeChip, hasLiked && styles.likeChipActive]}
          >
            <WinnixIcon
              name={hasLiked ? 'heart' : 'heart-outline'}
              size={14}
              color={hasLiked ? Colors.red_500 : Colors.text_primary}
            />
            <Text style={styles.likeText}>{likes}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', paddingTop: 10 },
  topNavHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  topNavLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surface_elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  profileTitleText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text_primary,
    letterSpacing: 1,
  },
  uniqueCodeBadge: {
    backgroundColor: Colors.brand_primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  copiedBadge: { backgroundColor: Colors.green_500 },
  uniqueCodeText: {
    color: Colors.surface_base,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroWrapper: {
    position: 'relative',
    marginHorizontal: 16,
    zIndex: 10,
    marginTop: 4,
  },
  heroCardBackdrop: {
    width: '100%',
    paddingVertical: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    overflow: 'hidden',
  },
  heroCardBackdropPortrait: {
    paddingVertical: 0,
    height: 280,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  portraitAvatarContainer: {
    width: '78%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  portraitAvatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarCentralWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGradientRing: {
    width: 116,
    height: 116,
    borderRadius: 58,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  avatarInnerContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
    backgroundColor: Colors.surface_screen,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarFallbackContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surface_elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.brand_primary,
    letterSpacing: 1,
  },
  avatarStatusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: Colors.brand_primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface_screen,
  },
  floatingBubble: {
    position: 'absolute',
    top: 36,
    backgroundColor: 'rgba(14, 21, 41, 0.95)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: 74,
    elevation: 8,
    zIndex: 20,
    borderWidth: 2,
  },
  portraitFloatingBubbleLeft: {
    left: 4,
    top: 96,
  },
  portraitFloatingBubbleRight: {
    right: 4,
    top: 96,
  },
  leftBubble: { left: -6 },
  rightBubble: { right: -6 },
  bubbleLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  bubbleValue: {
    color: Colors.text_primary,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 24,
    marginVertical: 2,
  },
  bubbleSub: { color: Colors.text_tertiary, fontSize: 9, fontWeight: '800' },
  floatingInfoSection: {
    paddingHorizontal: 20,
    marginTop: 16,
    backgroundColor: 'transparent',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gamertag: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.text_primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 12,
  },
  subtitleText: { fontSize: 13, color: Colors.brand_primary, fontWeight: '700' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  chip: {
    backgroundColor: Colors.surface_elevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  chipText: { color: Colors.text_secondary, fontSize: 11, fontWeight: '700' },
  roleChip: {
    backgroundColor: Colors.brand_primary + '25',
    borderColor: Colors.brand_primary,
  },
  roleChipText: { color: Colors.brand_primary, fontSize: 11, fontWeight: '800' },
  activeChip: {
    backgroundColor: Colors.green_900 + '40',
    borderColor: Colors.green_500,
    borderWidth: 1,
  },
  activeChipText: { color: Colors.green_400, fontSize: 11, fontWeight: '800' },
  likeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface_elevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  likeChipActive: { backgroundColor: Colors.red_900 + '40', borderColor: Colors.red_500 },
  likeText: { color: Colors.text_primary, fontSize: 12, fontWeight: 'bold' },
});
