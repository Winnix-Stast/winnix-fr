import { Team } from '@/core/teams/interface/team.interface';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { CustomButton } from '@/presentation/theme/components';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface PlayerTeamCardProps {
  team: Team;
  currentUserId?: string;
  onRespond?: (teamId: string, action: 'ACCEPT' | 'REJECT') => void;
  isResponding?: boolean;
}

export const PlayerTeamCard: React.FC<PlayerTeamCardProps> = ({
  team,
  currentUserId,
  onRespond,
  isResponding,
}) => {
  const isCaptain = currentUserId === team.captain?._id;
  const isPending = team.membershipStatus === 'pending';
  const isJoinRequest = team.invitationType === 'JOIN_REQUEST';
  const isInactive = team.isMemberActive === false;
  const captainName = team.captain?.nickname || team.captain?.username || 'Capitán';
  const captainAvatar = team.captain?.avatar;
  const sportName = team.sport?.name?.toUpperCase() || 'FÚTBOL';

  const stats = team.globalStats || {
    totalGoals: 0,
    titlesWon: 0,
    matchesWon: 0,
  };

  const roleLabel = isCaptain
    ? 'CAPITÁN'
    : isPending
      ? isJoinRequest
        ? 'SOLICITUD PENDIENTE'
        : 'INVITACIÓN PENDIENTE'
      : isInactive
        ? 'INACTIVO'
        : 'MI ESCUADRA';

  const roleColor = isCaptain
    ? Colors.orange_400
    : isPending
      ? Colors.status_draft
      : isInactive
        ? Colors.text_tertiary
        : Colors.brand_primary;

  const roleIcon = isCaptain
    ? 'star'
    : isPending
      ? 'time-outline'
      : isInactive
        ? 'pause-circle-outline'
        : 'shield-checkmark';

  return (
    <Pressable
      onPress={() => router.push(`/winnix/team/${team._id}`)}
      style={({ pressed }) => [
        styles.cardContainer,
        isPending && styles.cardPending,
        isInactive && styles.cardInactive,
        pressed && styles.cardPressed,
      ]}
    >
      <LinearGradient
        colors={[Colors.surface_elevated, Colors.surface_base]}
        style={styles.cardGradient}
      >
        {/* Fila Superior: Deporte e Insignia de Rol */}
        <View style={styles.topRow}>
          <View style={styles.sportBadge}>
            <WinnixIcon name='football' size={11} color={Colors.brand_primary} />
            <Text style={styles.sportText}>{sportName}</Text>
          </View>

          <View
            style={[
              styles.roleBadge,
              {
                borderColor: isInactive ? 'rgba(255, 255, 255, 0.15)' : roleColor,
                backgroundColor: isInactive ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.3)',
              },
            ]}
          >
            <WinnixIcon
              name={roleIcon as any}
              size={11}
              color={roleColor}
            />
            <Text style={[styles.roleText, { color: roleColor }]}>{roleLabel}</Text>
          </View>
        </View>

        {/* Bloque Central: Escudo + Información del Equipo */}
        <View style={styles.centerDetails}>
          <View style={styles.logoWrapper}>
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

          <View style={styles.titleWrapper}>
            <Text style={styles.teamName} numberOfLines={1}>
              {team.name || 'EQUIPO'}
            </Text>

            <View style={styles.captainRow}>
              {captainAvatar ? (
                <Image source={{ uri: captainAvatar }} style={styles.captainAvatar} />
              ) : (
                <WinnixIcon name='person-circle-outline' size={14} color={Colors.text_tertiary} />
              )}
              <Text style={styles.captainNameText} numberOfLines={1}>
                Capitán: {captainName}
              </Text>
            </View>
          </View>

          <View style={styles.chevronCircle}>
            <WinnixIcon
              name='chevron-forward'
              size={15}
              color={isPending ? Colors.status_draft : Colors.brand_primary}
            />
          </View>
        </View>

        {/* Fila de Estadísticas HUD */}
        <View style={styles.statsGrid}>
          <View style={styles.statCell}>
            <WinnixIcon name='football-outline' size={13} color={Colors.green_400} />
            <View>
              <Text style={styles.statLabel}>GOLES</Text>
              <Text style={[styles.statValue, { color: Colors.green_400 }]}>
                {stats.totalGoals ?? 0}
              </Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCell}>
            <WinnixIcon name='trophy-outline' size={13} color={Colors.orange_400} />
            <View>
              <Text style={styles.statLabel}>TÍTULOS</Text>
              <Text style={[styles.statValue, { color: Colors.orange_400 }]}>
                {stats.titlesWon ?? 0}
              </Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCell}>
            <WinnixIcon name='flash-outline' size={13} color={Colors.brand_secondary} />
            <View>
              <Text style={styles.statLabel}>VICTORIAS</Text>
              <Text style={[styles.statValue, { color: Colors.brand_secondary }]}>
                {stats.matchesWon ?? 0} PG
              </Text>
            </View>
          </View>
        </View>

        {/* Botones de Acción Rápida SOLO para Jugador Invitado por el Capitán */}
        {isPending && !isJoinRequest && (
          <View
            style={styles.pendingActionsRow}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <View style={{ flex: 1 }}>
              <CustomButton
                label='RECHAZAR'
                iconColor='#EF4444'
                iconSize={16}
                outline
                onPress={() => onRespond?.(team._id, 'REJECT')}
                disabled={isResponding}
                stylePressable={styles.rejectBtn}
                styleText={styles.rejectBtnText}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomButton
                label='ACEPTAR'
                iconColor='#030819'
                iconSize={16}
                onPress={() => onRespond?.(team._id, 'ACCEPT')}
                disabled={isResponding}
                stylePressable={styles.acceptBtn}
                styleText={styles.acceptBtnText}
              />
            </View>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: 'rgba(40, 209, 195, 0.25)',
  },
  cardPending: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  cardInactive: {
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },
  cardGradient: {
    padding: 16,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sportText: {
    color: Colors.text_tertiary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  roleText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  centerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.surface_elevated,
    borderWidth: 1.5,
    borderColor: 'rgba(40, 209, 195, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  titleWrapper: {
    flex: 1,
    gap: 3,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text_primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  captainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  captainAvatar: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  captainNameText: {
    fontSize: 11,
    color: Colors.text_secondary,
    fontWeight: '600',
  },
  chevronCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  statLabel: {
    color: Colors.text_tertiary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 11,
    fontWeight: '900',
  },
  pendingActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  rejectBtn: {
    minHeight: 38,
    paddingVertical: 0,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderWidth: 1,
  },
  rejectBtnText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  acceptBtn: {
    minHeight: 38,
    paddingVertical: 0,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.brand_primary,
    borderWidth: 0,
  },
  acceptBtnText: {
    color: '#030819',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
