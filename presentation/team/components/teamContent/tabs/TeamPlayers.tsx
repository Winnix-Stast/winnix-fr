import { CustomPaginationInfinityScroll } from '@/presentation/components/CustomPaginationInfinityScroll';
import { Colors } from '@/presentation/styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AddPlayerModal } from '../modals/AddPlayerModal';
import { SectionTitle } from '../shared/SectionTitle';
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
  onToggle,
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
      ]}
    >
      {/* Avatar */}
      <View style={[styles.avatarWrapper, !isActive && { borderColor: '#475569' }]}>
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
        <Text style={styles.playerName} numberOfLines={1}>
          {player?.username
            ? player?.username?.toUpperCase()
            : player?.nickname?.toUpperCase()}
        </Text>

        <View style={styles.positionRow}>
          <Text style={styles.playerPosition}>{player?.position || 'Jugador'}</Text>
          {state === 'pending' && (
            <View style={styles.pendingBadge}>
              <Ionicons name='time-outline' size={11} color='#F59E0B' />
              <Text style={styles.pendingBadgeText}>INVITACIÓN PENDIENTE</Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <PlayerMiniStat label='PJ' value={stats?.matchesPlayed || 0} />
          <PlayerMiniStat label='GOLES' value={stats?.goals || 0} />
        </View>
      </View>

      {!isActive ? (
        <View style={styles.deactivatedActionsCol}>
          {isCaptain && (
            <TouchableOpacity
              onPress={onToggle}
              disabled={isToggling}
              style={styles.reactivateBtn}
              activeOpacity={0.8}
            >
              {isToggling ? (
                <ActivityIndicator size='small' color='#000' />
              ) : (
                <>
                  <Ionicons name='flash' size={13} color='#000' />
                  <Text style={styles.reactivateBtnText}>REACTIVAR</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <View style={styles.deactivatedBadge}>
            <Ionicons name='person-remove-outline' size={10} color='#EF4444' />
            <Text style={styles.deactivatedBadgeText}>DESVINCULADO</Text>
          </View>
        </View>
      ) : isEditing ? (
        <View style={styles.editingActionsRow}>
          <TouchableOpacity
            onPress={onToggle}
            disabled={isToggling}
            style={[styles.toggleBtn, isActive ? styles.activeBtn : styles.inactiveBtn]}
          >
            {isToggling ? (
              <ActivityIndicator size='small' color='#fff' />
            ) : (
              <Ionicons
                name={isActive ? 'eye-outline' : 'eye-off-outline'}
                size={18}
                color='#fff'
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onRemove}
            disabled={isToggling}
            style={styles.deleteBtn}
          >
            <Ionicons name='trash-outline' size={18} color='#FF4D4D' />
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
}: any) => {
  const [isAddModalVisible, setIsAddModalVisible] = React.useState(false);

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

      {/* Botón Estilo Gamer / HUD para Reclutar Jugadores (Solo visible para el Capitán) */}
      {isCaptain && (
        <View style={styles.actionHeaderWrapper}>
          <TouchableOpacity
            style={styles.addPlayerGamerBtn}
            onPress={() => setIsAddModalVisible(true)}
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
              <Ionicons name='chevron-forward' size={16} color={Colors.brand_primary} />
            </LinearGradient>
          </TouchableOpacity>
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
            renderItem={({ item: member, index }: any) => (
              <PlayerCard
                key={member.player?._id || index}
                player={member.player}
                stats={member.playerGlobalStats}
                index={index}
                isActive={member.isActive}
                state={member.state}
                isEditing={isEditing}
                isCaptain={isCaptain}
                isToggling={isTogglingMember}
                onToggle={() => toggleMemberStatus(member.player?._id, member.isActive)}
                onRemove={() =>
                  handleConfirmRemove(
                    member.player?._id,
                    member.player?.username || member.player?.nickname || 'Jugador',
                    member.state === 'pending',
                  )
                }
                onPress={() => router.push(`/winnix/profile/${member.player?._id}`)}
              />
            )}
          />
        )}
      </View>

      {/* Modal de Reclutamiento de Jugadores */}
      <AddPlayerModal
        visible={isAddModalVisible}
        teamId={team?._id}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={() => {
          if (refresh) refresh();
        }}
      />
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
    backgroundColor: '#0B132B',
    borderColor: 'rgba(148, 163, 184, 0.35)',
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
  playerName: {
    color: Colors.text_primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
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
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    borderWidth: 1.5,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    gap: 4,
  },
  pendingBadgeText: {
    color: '#F59E0B',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  deactivatedActionsCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  deactivatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    gap: 4,
  },
  deactivatedBadgeText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  reactivateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brand_primary,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 10,
    gap: 6,
    elevation: 3,
  },
  reactivateBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
