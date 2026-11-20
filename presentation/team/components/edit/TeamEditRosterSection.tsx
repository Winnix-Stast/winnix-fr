import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';
import { TeamRecruitBox } from '../teamContent/shared/TeamRecruitBox';

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  isSearchingPlayer: boolean;
  searchedPlayer: any;
  hasSearchedPlayer: boolean;
  isRecruiting: boolean;
  handleSearchPlayer: () => Promise<void>;
  handleRecruitPlayer: (userId: string) => Promise<void>;
  handleResetSearch: () => void;
  members: any[];
  isTogglingMember: boolean;
  handleRemoveMember: (playerId: string, displayName: string, isPending?: boolean) => void;
  handleToggleMember: (playerId: string, currentActive: boolean) => Promise<void>;
}

export const TeamEditRosterSection: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  isSearchingPlayer,
  searchedPlayer,
  hasSearchedPlayer,
  isRecruiting,
  handleSearchPlayer,
  handleRecruitPlayer,
  handleResetSearch,
  members,
  isTogglingMember,
  handleRemoveMember,
  handleToggleMember,
}) => {
  return (
    <View style={styles.container}>
      {/* Componente Reutilizable de Búsqueda y Reclutamiento */}
      <TeamRecruitBox
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isSearching={isSearchingPlayer}
        searchedPlayer={searchedPlayer}
        hasSearched={hasSearchedPlayer}
        isRecruiting={isRecruiting}
        onSearch={handleSearchPlayer}
        onRecruit={handleRecruitPlayer}
        onReset={handleResetSearch}
      />

      {/* Listado de Miembros Actuales */}
      <View style={styles.playersHeaderRow}>
        <View>
          <Text style={styles.sectionTitle}>Plantilla Oficial</Text>
          <Text style={styles.playersCountText}>
            {members.length}{' '}
            {members.length === 1 ? 'Atleta Registrado' : 'Atletas Registrados'}
          </Text>
        </View>
      </View>

      {members.length === 0 ? (
        <View style={styles.emptyState}>
          <WinnixIcon
            name='people-outline'
            size={48}
            color={Colors.text_tertiary}
          />
          <Text style={styles.emptyText}>
            No hay jugadores vinculados a esta escuadra todavía.
          </Text>
        </View>
      ) : (
        <View style={styles.playersList}>
          {members.map((member: any, index: number) => {
            const player = member.player;
            if (!player) return null;

            const displayName =
              player.nickname ? `@${player.nickname}` : player.username || 'Sin Nombre';
            const isPending = member.state === 'pending';
            const isActive = member.isActive && !isPending;
            const statusColor = isPending
              ? '#F59E0B'
              : isActive
              ? Colors.status_finished
              : Colors.status_cancelled;
            const statusLabel = isPending
              ? 'INVITACIÓN PENDIENTE'
              : isActive
              ? 'ACTIVO'
              : 'DESVINCULADO';

            return (
              <View
                key={player._id || index}
                style={[
                  styles.playerCard,
                  !isActive && !isPending && styles.playerCardInactive,
                  isPending && styles.playerCardPending,
                ]}
              >
                <Image
                  source={
                    player.avatar
                      ? { uri: player.avatar }
                      : require('@/assets/icons/brand/default/default2.png')
                  }
                  style={styles.playerAvatar}
                />

                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.playerNameText} numberOfLines={1}>
                    {displayName.toUpperCase()}
                  </Text>
                  <Text style={styles.playerPositionText}>
                    {player.position || 'Jugador'} · Dorsal #{player.jerseyNumber || '0'}
                  </Text>
                  <View style={styles.statusBadgeRow}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: statusColor },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusLabelText,
                        { color: statusColor },
                      ]}
                    >
                      {statusLabel}
                    </Text>
                  </View>
                </View>

                {/* Acciones para el atleta */}
                <View style={styles.playerActionButtons}>
                  {isPending ? (
                    <TouchableOpacity
                      onPress={() =>
                        handleRemoveMember(player._id, displayName, true)
                      }
                      disabled={isTogglingMember}
                      style={styles.cancelInvitationBtn}
                    >
                      <WinnixIcon name='close-circle-outline' size={16} color='#F59E0B' />
                      <Text style={styles.cancelInvitationText}>Cancelar</Text>
                    </TouchableOpacity>
                  ) : isActive ? (
                    <TouchableOpacity
                      onPress={() =>
                        handleRemoveMember(player._id, displayName, false)
                      }
                      disabled={isTogglingMember}
                      style={styles.deactivateActionBtn}
                    >
                      <WinnixIcon name='trash-outline' size={16} color={Colors.status_cancelled} />
                      <Text style={styles.deactivateActionText}>Desvincular</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleToggleMember(player._id, false)}
                      disabled={isTogglingMember}
                      style={styles.reactivateActionBtn}
                    >
                      <WinnixIcon name='flash' size={14} color='#000' />
                      <Text style={styles.reactivateActionText}>Reactivar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text_secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 6,
    marginBottom: 4,
  },
  playersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  playersCountText: {
    fontSize: 12,
    color: Colors.text_tertiary,
    marginTop: 2,
  },
  playersList: {
    gap: 10,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface_elevated,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  playerCardInactive: {
    opacity: 0.6,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  playerCardPending: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
  },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(3,8,25,0.4)',
  },
  playerNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.text_primary,
    letterSpacing: 0.5,
  },
  playerPositionText: {
    fontSize: 11,
    color: Colors.text_tertiary,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabelText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  playerActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelInvitationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
  cancelInvitationText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  deactivateActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
  deactivateActionText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.status_cancelled,
  },
  reactivateActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brand_primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
  reactivateActionText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.surface_elevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 12,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.text_tertiary,
    textAlign: 'center',
  },
});
