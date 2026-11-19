import { teamsAdapter } from '@/core/teams/teams-adapter';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface TeamItemProps {
  activeFilter?: string;
  isMyTeam?: boolean;
  team: {
    _id: string;
    id?: string;
    name: string;
    logo?: string;
    captain?: any;
    playersCount?: number;
    isFavorite?: boolean;
    membershipStatus?: 'accepted' | 'pending' | 'rejected' | string;
    globalStats?: {
      matchesPlayed?: number;
      matchesWon?: number;
      totalGoals?: number;
      totalDraws?: number;
      totalLost?: number;
      titlesWon?: number;
      winStreak?: number;
    };
  };
}

export const TeamItem: React.FC<TeamItemProps> = ({
  team,
  activeFilter = 'ALL',
  isMyTeam = false,
}) => {
  const { user } = useAuthStore();
  const [favorite, setFavorite] = useState<boolean>(team.isFavorite || false);
  const [isToggling, setIsToggling] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [isSubmittingJoin, setIsSubmittingJoin] = useState(false);

  const teamId = team._id;
  const userId = user?.id;

  const membershipStatus = (team as any).membershipStatus;
  const isPending = membershipStatus === 'pending' || hasRequested;
  const isAccepted =
    membershipStatus === 'accepted' ||
    (isMyTeam && !isPending && membershipStatus !== 'rejected');

  const handleNavigateDetail = () => {
    console.log('📍 [TeamItem] Navegando a detalle de equipo:', teamId);
    if (teamId) {
      router.push(`/winnix/team/${teamId}`);
    }
  };

  const handleRequestJoin = async () => {
    console.log('🚀 [TeamItem] handleRequestJoin iniciado! userId:', userId, 'teamId:', teamId);
    if (!userId || !teamId || isSubmittingJoin || isPending || isAccepted) {
      return;
    }
    try {
      setIsSubmittingJoin(true);
      console.log('📡 [TeamItem] Enviando solicitud a teamsAdapter.requestJoinTeam...');
      await teamsAdapter.requestJoinTeam(teamId, userId);
      setHasRequested(true);
      useAlertStore.getState().showAlert({
        title: '¡Solicitud Enviada!',
        message: `Tu solicitud para unirte a ${team.name} ha sido enviada al capitán. Podrás seguir el estado en 'Mis Equipos'.`,
        type: 'success',
        confirmText: 'Entendido',
      });
    } catch (err: any) {
      console.log('❌ [TeamItem] Error en handleRequestJoin:', err);
      const errMsg = err?.message || err?.error || '';
      if (typeof errMsg === 'string' && (errMsg.includes('pendiente') || errMsg.includes('miembro'))) {
        setHasRequested(true);
      }
      useAlertStore.getState().showAlert({
        title: 'Solicitud de Ingreso',
        message: typeof errMsg === 'string' && errMsg.length > 0
          ? errMsg
          : `No se pudo enviar la solicitud a ${team.name}. Intenta nuevamente.`,
        type: 'info',
        confirmText: 'Entendido',
      });
    } finally {
      setIsSubmittingJoin(false);
    }
  };

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleToggleFavorite = async () => {
    if (isToggling || !teamId) return;
    try {
      setIsToggling(true);
      const nextState = !favorite;
      setFavorite(nextState);
      await teamsAdapter.updateTeam(teamId, { isFavorite: nextState });
    } catch (error) {
      setFavorite(favorite);
    } finally {
      setIsToggling(false);
    }
  };

  const captainName =
    typeof team.captain === 'object'
      ? team.captain?.username || team.captain?.nickname || 'Capitán'
      : 'Capitán';

  const captainAvatar =
    typeof team.captain === 'object' ? team.captain?.avatar : null;

  const stats = team.globalStats || {};
  const totalGoals = stats.totalGoals ?? 0;
  const titlesWon = stats.titlesWon ?? 0;
  const matchesWon = stats.matchesWon ?? 0;
  const playersCount = team.playersCount ?? 0;

  const isGoalsActive = activeFilter === 'GOALS';
  const isTitlesActive = activeFilter === 'TITLES';
  const isStreakActive = activeFilter === 'STREAK';

  const isMemberOrMine = isAccepted;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPress={handleNavigateDetail}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.pressableArea,
          isPending && { borderColor: 'rgba(251, 191, 36, 0.45)' },
          isMemberOrMine && { borderColor: 'rgba(40, 209, 195, 0.45)' },
        ]}
      >
        <LinearGradient
          colors={
            isPending
              ? ['#261D0F', '#181208']
              : isMemberOrMine
                ? ['#162B40', '#0E1D2E']
                : ['#18233C', '#11192C']
          }
          locations={[0, 1]}
          style={styles.gradientContainer}
        >
          {/* Header row: Crest + Name + Captain info + Favorite */}
          <View style={styles.headerDetails}>
            <View
              style={[
                styles.crestWrapper,
                isPending && { borderColor: 'rgba(251, 191, 36, 0.45)' },
              ]}
            >
              <Image
                source={
                  team.logo
                    ? { uri: team.logo }
                    : require('@/assets/icons/brand/default/default2.png')
                }
                style={styles.logoImage}
                resizeMode='cover'
              />
            </View>

            <View style={styles.teamMainInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.teamNameText} numberOfLines={1}>
                  {team.name || 'EQUIPO'}
                </Text>
                {isPending ? (
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>SOLICITUD PENDIENTE</Text>
                  </View>
                ) : isMemberOrMine ? (
                  <View style={styles.myTeamBadge}>
                    <Text style={styles.myTeamBadgeText}>MI ESCUADRA</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.captainSubRow}>
                {captainAvatar ? (
                  <Image
                    source={{ uri: captainAvatar }}
                    style={styles.captainAvatarImage}
                  />
                ) : (
                  <WinnixIcon name='person-circle-outline' size={14} color='#A5B4FC' />
                )}
                <Text style={styles.captainNameText} numberOfLines={1}>
                  Capitán: {captainName}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleToggleFavorite();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.favButton}
            >
              <WinnixIcon
                name={favorite ? 'star' : 'star-outline'}
                size={20}
                color={favorite ? '#FBBF24' : '#64748B'}
              />
            </TouchableOpacity>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsRow}>
            <View
              style={[
                styles.statItem,
                isGoalsActive && styles.statItemHighlight,
              ]}
            >
              <WinnixIcon
                name='football-outline'
                size={13}
                color={isGoalsActive ? '#28D1C3' : '#34D399'}
              />
              <View style={styles.statTextGroup}>
                <Text style={styles.statLabel}>GOLES</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: isGoalsActive ? '#28D1C3' : '#34D399' },
                  ]}
                >
                  {totalGoals}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View
              style={[
                styles.statItem,
                isTitlesActive && styles.statItemHighlight,
              ]}
            >
              <WinnixIcon
                name='trophy-outline'
                size={13}
                color={isTitlesActive ? '#28D1C3' : '#FBBF24'}
              />
              <View style={styles.statTextGroup}>
                <Text style={styles.statLabel}>TÍTULOS</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: isTitlesActive ? '#28D1C3' : '#FBBF24' },
                  ]}
                >
                  {titlesWon}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <WinnixIcon name='people-outline' size={13} color='#60A5FA' />
              <View style={styles.statTextGroup}>
                <Text style={styles.statLabel}>PLANTILLA</Text>
                <Text style={styles.statValue}>{playersCount} JUG</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View
              style={[
                styles.statItem,
                isStreakActive && styles.statItemHighlight,
              ]}
            >
              <WinnixIcon
                name='flash-outline'
                size={13}
                color={isStreakActive ? '#28D1C3' : '#A5B4FC'}
              />
              <View style={styles.statTextGroup}>
                <Text style={styles.statLabel}>VICTORIAS</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: isStreakActive ? '#28D1C3' : '#A5B4FC' },
                  ]}
                >
                  {matchesWon} PG
                </Text>
              </View>
            </View>
          </View>

          {/* Footer Card Navigation & Join Button */}
          <View style={styles.footer}>
            {isPending ? (
              <View style={styles.pendingFooterBadge}>
                <WinnixIcon name='time-outline' size={13} color='#FBBF24' />
                <Text style={styles.pendingFooterText}>SOLICITUD ENVIADA</Text>
              </View>
            ) : isMemberOrMine ? (
              <View style={styles.memberBadgeContainer}>
                <WinnixIcon name='shield-checkmark' size={12} color='#28D1C3' />
                <Text style={styles.memberBadgeText}>MIEMBRO DE LA PLANTILLA</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={(e) => {
                  console.log('👆 [TeamItem] Boton UNIRSE AL EQUIPO tocado!');
                  e.stopPropagation();
                  handleRequestJoin();
                }}
                disabled={isSubmittingJoin}
                activeOpacity={0.7}
                style={styles.joinButton}
              >
                {isSubmittingJoin ? (
                  <ActivityIndicator size='small' color='#000000' />
                ) : (
                  <>
                    <WinnixIcon name='person-add' size={12} color='#000000' />
                    <Text style={styles.joinButtonText}>UNIRSE AL EQUIPO</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleNavigateDetail}
              style={styles.footerRight}
            >
              <Text style={styles.footerText}>VER PLANTILLA</Text>
              <View style={styles.chevronCircle}>
                <WinnixIcon name='chevron-forward-outline' size={13} color='#28D1C3' />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    borderRadius: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pressableArea: {
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  gradientContainer: {
    padding: 16,
    gap: 14,
  },
  headerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crestWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#070A1E',
    borderWidth: 1.5,
    borderColor: 'rgba(40, 209, 195, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  teamMainInfo: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamNameText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  myTeamBadge: {
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.3)',
  },
  myTeamBadgeText: {
    color: '#28D1C3',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pendingBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  pendingBadgeText: {
    color: '#FBBF24',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pendingFooterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.35)',
  },
  pendingFooterText: {
    color: '#FBBF24',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  captainSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  captainAvatarImage: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  captainNameText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  favButton: {
    padding: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statItemHighlight: {
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
  },
  statTextGroup: {
    gap: 1,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#28D1C3',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  joinButtonText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  memberBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(40, 209, 195, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.3)',
  },
  memberBadgeText: {
    color: '#28D1C3',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 'auto',
  },
  footerText: {
    color: '#28D1C3',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  chevronCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(40, 209, 195, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
