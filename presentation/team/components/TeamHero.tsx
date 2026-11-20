import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/presentation/styles/colors';

interface TeamHeroProps {
  team: any;
  onToggleFavorite: (id: string, isFav: boolean) => void;
  isEditing?: boolean;
  onEdit?: () => void;
  isCaptain?: boolean;
  isMember?: boolean;
  isPendingInvitation?: boolean;
  isPendingJoinRequest?: boolean;
  isRespondingInvitation?: boolean;
  onRespondInvitation?: (action: 'ACCEPT' | 'REJECT') => void;
  hasRequestedJoin?: boolean;
  isSubmittingJoin?: boolean;
  isSubmittingLeave?: boolean;
  onJoinRequest?: () => void;
  onLeaveRequest?: () => void;
}

export const TeamHero = ({
  team,
  onToggleFavorite,
  isEditing,
  onEdit,
  isCaptain,
  isMember,
  isPendingInvitation,
  isPendingJoinRequest,
  isRespondingInvitation,
  onRespondInvitation,
  hasRequestedJoin,
  isSubmittingJoin,
  isSubmittingLeave,
  onJoinRequest,
  onLeaveRequest,
}: TeamHeroProps) => {
  const isAlreadyOnTeam = isMember || hasRequestedJoin;

  return (
    <View style={styles.heroSection}>
      <LinearGradient
        colors={['rgba(40, 209, 195, 0.15)', 'transparent', 'rgba(3, 8, 25, 0.8)']}
        style={styles.heroGradient}
      />

      <Animated.View
        entering={FadeIn.delay(100).duration(800)}
        style={styles.heroContent}
      >
        <View style={styles.logoWrapper}>
          <View style={styles.logoGlow} />
          <View style={styles.logoBracketTop} />
          <View style={styles.logoBracketBottom} />
          <Image
            source={
              team.logo
                ? { uri: team.logo }
                : require('@/assets/icons/brand/default/escudo2.png')
            }
            style={styles.logo}
            resizeMode='cover'
          />

          {isEditing && (
            <TouchableOpacity onPress={onEdit} style={styles.logoEditOverlay}>
              <View style={styles.logoEditCircle}>
                <Ionicons name='camera' size={24} color='#fff' />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleInfo}>
          <Pressable onPress={isEditing ? onEdit : undefined} style={styles.nameRow}>
            <Text style={styles.teamNameText}>{team.name.toUpperCase()}</Text>
            {isEditing && (
              <View style={styles.nameEditIcon}>
                <Ionicons name='pencil' size={16} color={Colors.brand_primary} />
              </View>
            )}
          </Pressable>
          <View style={styles.sportBadge}>
            <View style={styles.sportDot} />
            <Text style={styles.sportText}>{team.sport?.name || 'EQUIPO'}</Text>
          </View>

          {/* Role Status, Member Badges & Actions */}
          {isCaptain ? (
            <View style={styles.captainHeroBadge}>
              <Ionicons name='star' size={14} color='#000000' />
              <Text style={styles.captainHeroBadgeText}>CAPITÁN DEL EQUIPO</Text>
            </View>
          ) : isPendingInvitation ? (
            <View style={styles.pendingInvitationContainer}>
              <View style={styles.pendingInvitationBadge}>
                <Ionicons name='time-outline' size={14} color={Colors.status_draft} />
                <Text style={styles.pendingInvitationBadgeText}>INVITACIÓN PENDIENTE</Text>
              </View>

              <View style={styles.heroInvitationActionsRow}>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onRespondInvitation?.('REJECT');
                  }}
                  disabled={isRespondingInvitation}
                  style={styles.heroRejectBtn}
                >
                  {isRespondingInvitation ? (
                    <ActivityIndicator size='small' color={Colors.status_cancelled} />
                  ) : (
                    <>
                      <Ionicons name='close-outline' size={15} color={Colors.status_cancelled} />
                      <Text style={styles.heroRejectBtnText}>RECHAZAR</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onRespondInvitation?.('ACCEPT');
                  }}
                  disabled={isRespondingInvitation}
                  style={styles.heroAcceptBtn}
                >
                  {isRespondingInvitation ? (
                    <ActivityIndicator size='small' color='#000000' />
                  ) : (
                    <>
                      <Ionicons name='checkmark-outline' size={15} color='#000000' />
                      <Text style={styles.heroAcceptBtnText}>ACEPTAR</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : isPendingJoinRequest || hasRequestedJoin ? (
            <View style={styles.pendingHeroBadge}>
              <Ionicons name='time-outline' size={14} color={Colors.orange_400} />
              <Text style={styles.pendingHeroBadgeText}>SOLICITUD PENDIENTE</Text>
            </View>
          ) : isMember ? (
            <View style={styles.memberActionRow}>
              <View style={styles.memberHeroBadge}>
                <Ionicons name='shield-checkmark' size={14} color={Colors.brand_primary} />
                <Text style={styles.memberHeroBadgeText}>MIEMBRO DE LA PLANTILLA</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  if (onLeaveRequest) onLeaveRequest();
                }}
                disabled={isSubmittingLeave}
                style={styles.leaveHeroBtn}
              >
                {isSubmittingLeave ? (
                  <ActivityIndicator size='small' color={Colors.status_cancelled} />
                ) : (
                  <>
                    <Ionicons name='log-out-outline' size={14} color={Colors.status_cancelled} />
                    <Text style={styles.leaveHeroBtnText}>DEJAR EQUIPO</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                if (onJoinRequest) onJoinRequest();
              }}
              disabled={isSubmittingJoin}
              style={styles.joinHeroBtn}
            >
              {isSubmittingJoin ? (
                <ActivityIndicator size='small' color='#000000' />
              ) : (
                <>
                  <Ionicons name='person-add' size={16} color='#000000' />
                  <Text style={styles.joinHeroBtnText}>UNIRSE AL EQUIPO</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            onToggleFavorite(team._id, !!team.isFavorite);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          style={styles.favBtnHero}
        >
          <Ionicons
            name={team.isFavorite ? 'star' : 'star-outline'}
            size={22}
            color={team.isFavorite ? Colors.orange_400 : Colors.text_tertiary}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  heroGradient: {
    ...(StyleSheet.absoluteFill as any),
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  logoGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.brand_primary,
    opacity: 0.2,
    transform: [{ scale: 1.4 }],
    alignSelf: 'center',
    top: 0,
  },
  logoBracketTop: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.brand_primary,
  },
  logoBracketBottom: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.brand_primary,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.3)',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  titleInfo: {
    alignItems: 'center',
    gap: 8,
  },
  teamNameText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: Colors.brand_primary,
    textShadowRadius: 10,
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.brand_primary,
  },
  sportDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brand_primary,
    marginRight: 10,
  },
  sportText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  joinHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.brand_primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  joinHeroBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  captainHeroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FBBF24',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    marginTop: 8,
  },
  captainHeroBadgeText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  memberActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  memberHeroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.4)',
  },
  memberHeroBadgeText: {
    color: '#28D1C3',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pendingHeroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
    marginTop: 8,
  },
  pendingHeroBadgeText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  leaveHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  leaveHeroBtnText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  favBtnHero: {
    position: 'absolute',
    right: 20,
    bottom: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  logoEditOverlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  logoEditCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.brand_primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nameEditIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.brand_primary,
  },
  pendingInvitationContainer: {
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  pendingInvitationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  pendingInvitationBadgeText: {
    color: Colors.status_draft,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  heroInvitationActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroRejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  heroRejectBtnText: {
    color: Colors.status_cancelled,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  heroAcceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.brand_primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  heroAcceptBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
});
