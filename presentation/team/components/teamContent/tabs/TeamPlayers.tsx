import { CustomPaginationInfinityScroll } from '@/presentation/components/CustomPaginationInfinityScroll';
import { Colors } from '@/presentation/styles/colors';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { teamsActions } from '@/core/teams/actions/teams-actions';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SectionTitle } from '../shared/SectionTitle';
import { TeamRecruitBox } from '../shared/TeamRecruitBox';
import { PlayerCardProps } from '../types';

const PlayerMiniStat = ({ label, value }: { label: string; value: any }) => (
  <View style={styles.miniStatBox}>
    <Text style={styles.miniStatLabel}>{label}:</Text>
    <Text style={styles.miniStatValue}>{value}</Text>
  </View>
);

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  stats,
  index,
  onPress,
  isEditing,
  isCaptain,
  isActive,
  state,
  invitationType,
  isMe,
  onToggle,
  onDeactivate,
  onReactivate,
  onRemove,
  isToggling,
}) => (
  <Animated.View entering={FadeInDown.delay(index * 50)}>
    <Pressable
      onPress={isEditing ? undefined : onPress}
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && !isEditing && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        isEditing && styles.cardContainerEditing,
        !isActive && styles.cardContainerInactive,
        state === 'pending' && styles.cardContainerPending,
        isMe && state === 'accepted' && styles.cardContainerMe,
      ]}
    >
      {/* Avatar */}
      <View
        style={[
          styles.avatarWrapper,
          !isActive && { borderColor: Colors.text_tertiary },
          isMe && state === 'accepted' && { borderColor: Colors.brand_primary },
        ]}
      >
        <Image
          source={
            player?.avatar
              ? { uri: player.avatar }
              : require('@/assets/icons/brand/default/default2.png')
          }
          style={styles.avatarImage}
        />
      </View>

      {/* Información Principal */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.playerName} numberOfLines={1}>
            {player?.username
              ? player?.username?.toUpperCase()
              : player?.nickname?.toUpperCase()}
          </Text>
          {isMe && state === 'accepted' && (
            <View style={styles.meBadge}>
              <Text style={styles.meBadgeText}>TÚ</Text>
            </View>
          )}
        </View>

        <Text style={styles.playerPosition}>{player?.position || 'Jugador'}</Text>

        {state === 'pending' && (
          <View style={styles.pendingBadgeRow}>
            <View style={styles.pendingBadge}>
              <Ionicons name='time-outline' size={11} color='#F59E0B' />
              <Text style={styles.pendingBadgeText}>
                {invitationType === 'JOIN_REQUEST'
                  ? 'SOLICITUD PENDIENTE'
                  : 'INVITACIÓN PENDIENTE'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.statsRow}>
          <PlayerMiniStat label='PJ' value={stats?.matchesPlayed || 0} />
          <PlayerMiniStat label='GOLES' value={stats?.goals || 0} />
        </View>
      </View>

      {!isActive ? (
        <View style={styles.deactivatedActionsCol}>
          <View style={styles.inactiveBadge}>
            <Ionicons name='pause-circle-outline' size={11} color={Colors.text_tertiary} />
            <Text style={styles.inactiveBadgeText}>INACTIVO</Text>
          </View>

          {isCaptain && (
            <View style={styles.captainActionsRow}>
              <TouchableOpacity
                onPress={onReactivate || onToggle}
                disabled={isToggling}
                style={styles.reactivateBtn}
                activeOpacity={0.8}
              >
                {isToggling ? (
                  <ActivityIndicator size='small' color='#000' />
                ) : (
                  <>
                    <Ionicons name='flash' size={12} color='#000' />
                    <Text style={styles.reactivateBtnText}>REACTIVAR</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onRemove}
                disabled={isToggling}
                style={styles.deleteMiniBtn}
                activeOpacity={0.8}
              >
                <Ionicons name='trash-outline' size={14} color={Colors.red_400} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : isEditing ? (
        <View style={styles.editingActionsRow}>
          <TouchableOpacity
            onPress={onDeactivate || onToggle}
            disabled={isToggling}
            style={styles.pauseBtn}
          >
            <Ionicons name='pause' size={15} color='#F59E0B' />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onRemove}
            disabled={isToggling}
            style={styles.deleteBtn}
          >
            <Ionicons name='trash-outline' size={16} color='#FF4D4D' />
          </TouchableOpacity>
        </View>
      ) : state === 'pending' && isCaptain ? (
        <View style={styles.deactivatedActionsCol}>
          <TouchableOpacity
            onPress={onRemove}
            disabled={isToggling}
            style={styles.cancelPendingBtn}
            activeOpacity={0.8}
          >
            <Ionicons name='close-circle-outline' size={13} color='#F59E0B' />
            <Text style={styles.cancelPendingText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={[styles.dorsalBadge, !isActive && { opacity: 0.5 }]}>
            <Text style={styles.dorsalText}>{player?.jerseyNumber || '0'}</Text>
          </View>
          <Ionicons name='chevron-forward' size={20} color={Colors.text_tertiary} />
        </>
      )}
    </Pressable>
  </Animated.View>
);

import { useAlertStore } from '@/presentation/components/customs/useAlertStore';

export const TeamPlayers = ({
  team,
  members,
  router,
  isEditing,
  isCaptain,
  refresh,
  loadingMembers,
  fetchNextMembersPage,
  hasNextMembersPage,
  isFetchingNextMembersPage,
  toggleMemberStatus,
  isTogglingMember,
  handleDeactivateMember,
  handleReactivateMember,
  handleRemoveMember,
  isRemovingMember,
}: any) => {
  const { user } = useAuthStore();
  const currentUserId = user?.id;

  // Integrated Recruitment states (replaces floating popup modal)
  const [isRecruitingOpen, setIsRecruitingOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchedPlayer, setSearchedPlayer] = React.useState<any>(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [isRecruiting, setIsRecruiting] = React.useState(false);

  const handleResetSearch = () => {
    setSearchTerm('');
    setSearchedPlayer(null);
    setHasSearched(false);
  };

  const handleSearchPlayer = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setHasSearched(false);
    setSearchedPlayer(null);
    try {
      const player = await teamsActions.searchUserByTermAction(searchTerm.trim());
      setSearchedPlayer(player);
    } catch (e) {
      setSearchedPlayer(null);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  const handleRecruitPlayer = async (playerId: string) => {
    if (!team?._id || !playerId || isRecruiting) return;
    try {
      setIsRecruiting(true);
      await teamsActions.addMemberAction(team._id, playerId);
      useAlertStore.getState().showAlert({
        title: '¡Invitación Enviada!',
        message: 'Se ha enviado la invitación al atleta. Figurará como pendiente en la plantilla hasta que acepte.',
        type: 'success',
      });
      handleResetSearch();
      setIsRecruitingOpen(false);
      if (refresh) refresh();
    } catch (err: any) {
      const isConflict =
        err?.statusCode === 409 ||
        err?.status === 409 ||
        err?.response?.status === 409;
      if (isConflict) {
        useAlertStore.getState().showAlert({
          title: 'Jugador Ya Convocado',
          message: 'Este jugador ya forma parte de la plantilla o tiene una invitación pendiente.',
          type: 'warning',
        });
      } else {
        useAlertStore.getState().showAlert({
          title: 'Error de Reclutamiento',
          message: err?.response?.data?.message || err?.message || 'No se pudo enviar la invitación al jugador.',
          type: 'error',
        });
      }
    } finally {
      setIsRecruiting(false);
    }
  };

  const handleConfirmRemove = (
    playerId: string,
    playerName: string,
    isPending: boolean,
  ) => {
    useAlertStore.getState().showAlert({
      title: isPending ? '¿Cancelar Invitación?' : '¿Desvincular Jugador?',
      message: isPending
        ? `¿Deseas cancelar la invitación de ${playerName}? El registro se eliminará por completo.`
        : `¿Deseas desvincular a ${playerName} del plantel activo? Se conservarán sus estadísticas históricas.`,
      type: 'warning',
      confirmText: isPending ? 'Sí, Cancelar' : 'Sí, Desvincular',
      onConfirm: () => {
        toggleMemberStatus(playerId, true);
      },
    });
  };

  return (
    <View style={styles.contentPadding}>
      <SectionTitle title='PLANTILLA DE JUGADORES' icon='people' />

      {/* Botón Estilo Gamer y Tarjeta de Reclutamiento Integrada (Solo visible para el Capitán) */}
      {isCaptain && (
        <View style={styles.actionHeaderWrapper}>
          <TouchableOpacity
            style={styles.addPlayerGamerBtn}
            onPress={() => setIsRecruitingOpen((prev) => !prev)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(40, 209, 195, 0.2)', 'rgba(12, 18, 44, 0.8)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gamerBtnGradient}
            >
              <View style={styles.gamerIconBox}>
                <Ionicons name='person-add' size={18} color={Colors.brand_primary} />
              </View>
              <Text style={styles.gamerBtnText}>+ RECLUTAR JUGADOR</Text>
              <Ionicons
                name={isRecruitingOpen ? 'chevron-up' : 'chevron-forward'}
                size={16}
                color={Colors.brand_primary}
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* Tarjeta de Reclutamiento Integrada */}
          {isRecruitingOpen && (
            <Animated.View entering={FadeInDown.duration(250)} style={{ marginBottom: 12 }}>
              <TeamRecruitBox
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isSearching={isSearching}
                searchedPlayer={searchedPlayer}
                hasSearched={hasSearched}
                isRecruiting={isRecruiting}
                onSearch={handleSearchPlayer}
                onRecruit={handleRecruitPlayer}
                onReset={handleResetSearch}
                onClose={() => {
                  setIsRecruitingOpen(false);
                  handleResetSearch();
                }}
              />
            </Animated.View>
          )}
        </View>
      )}

      <View style={styles.playersList}>
        {loadingMembers && members.length === 0 ? (
          <ActivityIndicator
            size='large'
            color={Colors.brand_primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <CustomPaginationInfinityScroll
            data={members}
            fetchNextPage={fetchNextMembersPage}
            hasNextPage={hasNextMembersPage}
            isFetchingNextPage={isFetchingNextMembersPage}
            isLoading={loadingMembers}
            scrollEnabled={false}
            emptyMessage='No hay jugadores registrados'
            renderItem={({ item: member, index }: any) => {
              const playerId = member.player?._id || member.player?.id;
              const isMe = Boolean(currentUserId && playerId && String(playerId) === String(currentUserId));

              return (
                <PlayerCard
                  key={playerId || index}
                  player={member.player}
                  stats={member.playerGlobalStats}
                  index={index}
                  isActive={member.isActive}
                  state={member.state}
                  invitationType={member.invitationType}
                  isMe={isMe}
                  isEditing={isEditing}
                  isCaptain={isCaptain}
                  isToggling={isTogglingMember || isRemovingMember}
                  onToggle={() => toggleMemberStatus(member.player?._id, member.isActive)}
                  onDeactivate={() =>
                    handleDeactivateMember
                      ? handleDeactivateMember(
                          member.player?._id,
                          member.player?.nickname || member.player?.username,
                        )
                      : toggleMemberStatus(member.player?._id, true)
                  }
                  onReactivate={() =>
                    handleReactivateMember
                      ? handleReactivateMember(member.player?._id)
                      : toggleMemberStatus(member.player?._id, false)
                  }
                  onRemove={() =>
                    handleRemoveMember
                      ? handleRemoveMember(
                          member.player?._id,
                          member.player?.nickname || member.player?.username,
                          member.state === 'pending',
                        )
                      : handleConfirmRemove(
                          member.player?._id,
                          member.player?.username || member.player?.nickname || 'Jugador',
                          member.state === 'pending',
                        )
                  }
                  onPress={() => router.push(`/winnix/profile/${member.player?._id}`)}
                />
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentPadding: {
    paddingBottom: 20,
  },
  playersList: {
    paddingHorizontal: 15,
    gap: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface_elevated,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  cardContainerEditing: {
    borderColor: Colors.brand_primary + '40',
    borderLeftWidth: 4,
    borderLeftColor: Colors.brand_primary,
  },
  cardContainerInactive: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
    borderWidth: 1.5,
    opacity: 0.85,
  },
  cardContainerMe: {
    backgroundColor: 'rgba(40, 209, 195, 0.08)',
    borderColor: 'rgba(40, 209, 195, 0.45)',
    borderWidth: 1.5,
  },
  avatarWrapper: {
    marginRight: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.surface_pressed,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surface_base,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  playerName: {
    color: Colors.text_primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  meBadge: {
    backgroundColor: 'rgba(40, 209, 195, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.4)',
    marginLeft: 8,
  },
  meBadgeText: {
    color: '#28D1C3',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  playerPosition: {
    color: Colors.text_tertiary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  miniStatBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniStatLabel: {
    color: Colors.text_tertiary,
    fontSize: 14,
    marginRight: 4,
  },
  miniStatValue: {
    color: Colors.brand_primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  dorsalBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.brand_primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  dorsalText: {
    color: Colors.on_brand,
    fontSize: 18,
    fontWeight: '900',
  },
  toggleBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  activeBtn: {
    backgroundColor: Colors.brand_primary + '30',
  },
  editingActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 19,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  inactiveBtn: {
    backgroundColor: Colors.red_400 + '30',
  },
  actionHeaderWrapper: {
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  addPlayerGamerBtn: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.4)',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  gamerBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  gamerIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.brand_primary,
  },
  gamerBtnText: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cardContainerPending: {
    backgroundColor: Colors.surface_elevated,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 1,
  },
  pendingBadgeRow: {
    marginTop: 2,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.22)',
    gap: 4,
  },
  pendingBadgeText: {
    color: '#F59E0B',
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  deactivatedActionsCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  inactiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    gap: 4,
  },
  inactiveBadgeText: {
    color: Colors.text_tertiary,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  captainActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deleteMiniBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelPendingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
  },
  cancelPendingText: {
    color: Colors.text_secondary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  reactivateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brand_primary,
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 8,
    gap: 4,
    elevation: 3,
  },
  reactivateBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
