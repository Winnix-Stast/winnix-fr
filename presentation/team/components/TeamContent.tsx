import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/presentation/styles/colors';
import { CustomPaginationInfinityScroll } from '../../components/CustomPaginationInfinityScroll';

const { width } = Dimensions.get('window');

interface TeamContentProps {
  team: any;
  activeTab: string;
  router: any;
  isEditing?: boolean;
  refresh?: () => void;
  // Members Pagination
  members: any[];
  loadingMembers?: boolean;
  fetchNextMembersPage: () => void;
  hasNextMembersPage: boolean;
  isFetchingNextMembersPage: boolean;
  toggleMemberStatus: (playerId: string, isActive: boolean) => void;
  isTogglingMember: boolean;
}

export const TeamContent = ({
  team,
  activeTab,
  router,
  isEditing,
  refresh,
  members,
  loadingMembers,
  fetchNextMembersPage,
  hasNextMembersPage,
  isFetchingNextMembersPage,
  toggleMemberStatus,
  isTogglingMember,
}: TeamContentProps) => {
  console.log('team aqui :>> ', team);
  return (
    <Animated.View
      key={activeTab}
      entering={FadeInDown.duration(400).springify()}
      style={styles.tabContent}
    >
      {activeTab === 'stats' && <TeamStats team={team} />}
      {activeTab === 'players' && (
        <TeamPlayers
          members={members}
          activeTab={activeTab}
          router={router}
          isEditing={isEditing}
          refresh={refresh}
          loadingMembers={loadingMembers}
          fetchNextMembersPage={fetchNextMembersPage}
          hasNextMembersPage={hasNextMembersPage}
          isFetchingNextMembersPage={isFetchingNextMembersPage}
          toggleMemberStatus={toggleMemberStatus}
          isTogglingMember={isTogglingMember}
        />
      )}
      {activeTab === 'tournaments' && <TeamTournaments team={team} />}
      {activeTab === 'matches' && <TeamMatches />}
      {activeTab === 'sponsors' && <TeamSponsors team={team} />}
    </Animated.View>
  );
};

const TeamStats = ({ team }: { team: any }) => (
  <View style={styles.contentPadding}>
    <SectionTitle title='ESTADÍSTICAS' icon='analytics' />
    <View style={styles.statsGrid}>
      <StatCard
        label='PARTIDOS'
        value={team.globalStats?.matchesPlayed || 0}
        icon='football'
        color={Colors.brand_primary}
        delay={100}
      />
      <StatCard
        label='TÍTULOS'
        value={team.globalStats?.titlesWon || 0}
        icon='trophy'
        color={Colors.brand_primary}
        delay={200}
        isHighlight
      />
      <StatCard
        label='VICTORIAS'
        value={team.globalStats?.matchesWon || 0}
        icon='radio-button-on'
        color={Colors.green_400}
        delay={300}
      />
      <StatCard
        label='RACHA'
        value={`${team.globalStats?.winStreak || 0} 🔥`}
        icon='flame'
        color={Colors.orange_400}
        delay={400}
      />
      <StatCard
        label='EMPATES'
        value={team.globalStats?.totalDraws || 0}
        icon='remove-circle-outline'
        color={Colors.text_tertiary}
        delay={500}
      />
      <StatCard
        label='DERROTAS'
        value={team.globalStats?.totalLost || 0}
        icon='alert-circle-outline'
        color={Colors.red_400}
        delay={600}
      />
      <StatCard
        label='GOLES A FAVOR'
        value={team.globalStats?.totalGoals || 0}
        icon='infinite'
        color={Colors.brand_primary}
        delay={700}
        fullWidth
      />
    </View>
  </View>
);

const TeamPlayers = ({
  members,
  router,
  isEditing,
  refresh,
  loadingMembers,
  fetchNextMembersPage,
  hasNextMembersPage,
  isFetchingNextMembersPage,
  toggleMemberStatus,
  isTogglingMember,
}: any) => {
  return (
    <View style={styles.contentPadding}>
      <SectionTitle title='PLANTILLA DE JUGADORES' icon='people' />
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
            scrollEnabled={false} // Since it's inside parent scroll
            emptyMessage='No hay jugadores registrados'
            renderItem={({ item: member, index }: any) => (
              <PlayerCard
                key={member.player?._id || index}
                player={member.player}
                stats={member.playerGlobalStats}
                index={index}
                isActive={member.isActive}
                isEditing={isEditing}
                isToggling={isTogglingMember}
                onToggle={() => toggleMemberStatus(member.player?._id, member.isActive)}
                onPress={() => router.push(`/winnix/profile/${member.player?._id}`)}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

const TeamTournaments = ({ team }: { team: any }) => (
  <View style={styles.contentPadding}>
    <SectionTitle title='TORNEOS Y LIGAS' icon='map' />
    <View style={styles.infoSection}>
      {team.tournaments?.length > 0 ? (
        team.tournaments.map((t: any, index: number) => (
          <TournamentItem
            key={t.tournament?._id || index}
            tournament={t.tournament}
            index={index}
          />
        ))
      ) : (
        <EmptySection message='El equipo no está inscrito en torneos' />
      )}
    </View>
  </View>
);

const TeamMatches = () => (
  <View style={styles.contentPadding}>
    <SectionTitle title='PRÓXIMOS PARTIDOS' icon='time' />
    <View style={styles.infoSection}>
      <EmptySection message='No hay partidos programados' />
    </View>
  </View>
);

const TeamSponsors = ({ team }: { team: any }) => (
  <View style={styles.contentPadding}>
    <SectionTitle title='PATROCINADORES' icon='business' />
    <View style={styles.sponsorsGrid}>
      {team.sponsor ? (
        <View style={styles.sponsorCard}>
          <View style={styles.sponsorIconWrapper}>
            <Ionicons name='shield-checkmark' size={40} color={Colors.brand_primary} />
          </View>
          <Text style={styles.sponsorName}>SPONSOR PRINCIPAL</Text>
          <Text style={styles.sponsorSub}>PATROCINADOR OFICIAL</Text>
        </View>
      ) : (
        <EmptySection message='Buscando patrocinadores' />
      )}
    </View>
  </View>
);

// --- HELPER COMPONENTS ---
const SectionTitle = ({ title, icon }: { title: string; icon: any }) => (
  <Animated.View entering={FadeInRight.duration(600)} style={styles.sectionHeader}>
    <View style={styles.sectionIconBox}>
      <Ionicons name={icon} size={12} color={Colors.surface_base} />
    </View>
    <Text style={styles.sectionTitleText}>{title}</Text>
  </Animated.View>
);

const StatCard = ({ label, value, icon, color, delay, fullWidth, isHighlight }: any) => (
  <Animated.View
    entering={FadeInDown.delay(delay).duration(600)}
    style={[
      styles.statCard,
      fullWidth && { width: width - 30 },
      isHighlight && styles.statCardHighlight,
    ]}
  >
    <View style={[styles.statIconCircle, { borderColor: color }]}>
      <Ionicons name={icon} size={14} color={color} />
    </View>
    <View>
      <Text
        style={[styles.statCardValue, isHighlight && { color: Colors.brand_primary }]}
      >
        {value}
      </Text>
      <Text style={styles.statCardLabel}>{label}</Text>
    </View>
    {isHighlight && <View style={styles.cornerMarker} />}
  </Animated.View>
);

const PlayerCard = ({
  player,
  stats,
  index,
  onPress,
  isEditing,
  isActive,
  onToggle,
  isToggling,
}: any) => (
  <Animated.View entering={FadeInDown.delay(index * 50)}>
    <Pressable
      onPress={isEditing ? undefined : onPress}
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && !isEditing && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        isEditing && styles.cardContainerEditing,
        !isActive && styles.cardContainerInactive,
      ]}
    >
      {/* Avatar */}
      <View style={[styles.avatarWrapper, !isActive && { opacity: 0.5 }]}>
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
        {/* Nombre real o Username */}
        <Text
          style={[styles.playerName, !isActive && { color: Colors.text_tertiary }]}
          numberOfLines={1}
        >
          {player?.username
            ? player?.username?.toUpperCase()
            : player?.nickname?.toUpperCase()}
        </Text>

        {/* Posición en la cancha (Opcional, ej: DEL, MED, DEF) */}
        <Text style={styles.playerPosition}>{player?.position || 'Jugador'}</Text>

        {/* Estadísticas con términos reales */}
        <View style={styles.statsRow}>
          <PlayerMiniStat label='PJ' value={stats?.matchesPlayed || 0} />
          <PlayerMiniStat label='GOLES' value={stats?.goals || 0} />
        </View>
      </View>

      {isEditing ? (
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
              size={20}
              color='#fff'
            />
          )}
        </TouchableOpacity>
      ) : (
        <>
          {/* Dorsal del Jugador */}
          <View style={[styles.dorsalBadge, !isActive && { opacity: 0.5 }]}>
            <Text style={styles.dorsalText}>{player?.jerseyNumber || '0'}</Text>
          </View>
          <Ionicons name='chevron-forward' size={20} color={Colors.text_tertiary} />
        </>
      )}
    </Pressable>
  </Animated.View>
);

const PlayerMiniStat = ({ label, value }: any) => (
  <View style={styles.miniStatBox}>
    <Text style={styles.miniStatLabel}>{label}:</Text>
    <Text style={styles.miniStatValue}>{value}</Text>
  </View>
);

const TournamentItem = ({ tournament, index }: any) => (
  <Animated.View
    entering={FadeInDown.delay(index * 50)}
    style={styles.tournamentItemGame}
  >
    <View style={styles.tournIconBox}>
      <Ionicons name='navigate-outline' size={18} color={Colors.brand_primary} />
    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.tournamentName}>
        {tournament?.name?.toUpperCase() || 'SECTOR'}
      </Text>
      <View style={styles.statusRow}>
        <View style={styles.statusDot} />
        <Text style={styles.tournamentStatus}>ESTADO: EN CURSO</Text>
      </View>
    </View>
  </Animated.View>
);

const EmptySection = ({ message }: { message: string }) => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyScanner} />
    <Text style={styles.emptyText}>{message.toUpperCase()}</Text>
  </View>
);

const styles = StyleSheet.create({
  tabContent: {
    minHeight: 350,
  },
  contentPadding: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 25,
    marginBottom: 20,
    gap: 12,
  },
  sectionIconBox: {
    width: 24,
    height: 24,
    backgroundColor: Colors.brand_primary,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  sectionTitleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 10,
  },
  statCard: {
    width: (width - 30) / 2,
    backgroundColor: 'rgba(10, 20, 50, 0.5)',
    borderRadius: 2,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.1)',
  },
  statCardHighlight: {
    borderColor: Colors.brand_primary,
    shadowColor: Colors.brand_primary,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
  statCardLabel: {
    fontSize: 12,
    color: Colors.text_tertiary,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  cornerMarker: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.brand_primary,
  },
  playersList: {
    paddingHorizontal: 15,
    gap: 12,
  },
  playerCardGame: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.brand_primary,
    borderRadius: 4,
  },
  playerAvatarWrapper: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerAvatarHex: {
    width: 60,
    height: 60,
    borderRadius: 0,
  },
  playerInfoGame: {
    flex: 1,
    marginLeft: 15,
  },
  playerNameGame: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  playerStatRowGame: {
    flexDirection: 'row',
    marginTop: 5,
    gap: 15,
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
  infoSection: {
    paddingHorizontal: 15,
    gap: 12,
  },
  tournamentItemGame: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 15,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tournIconBox: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(40, 209, 195, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.brand_primary,
  },
  tournamentName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.green_400,
    marginRight: 6,
  },
  tournamentStatus: {
    color: Colors.green_400,
    fontSize: 8,
    fontWeight: 'bold',
  },
  emptyContainer: {
    height: 160,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.1)',
  },
  emptyScanner: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 2,
    backgroundColor: Colors.brand_primary,
    opacity: 0.1,
  },
  emptyText: {
    color: Colors.text_tertiary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 4,
  },
  sponsorsGrid: {
    paddingHorizontal: 15,
  },
  sponsorCard: {
    backgroundColor: 'rgba(40, 209, 195, 0.03)',
    paddingVertical: 40,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.2)',
  },
  sponsorIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(40, 209, 195, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.brand_primary,
  },
  sponsorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3,
  },
  sponsorSub: {
    color: Colors.brand_primary,
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 8,
    letterSpacing: 2,
  },

  // -------------
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
  cardContainerEditing: {
    borderColor: Colors.brand_primary + '40',
    borderLeftWidth: 4,
    borderLeftColor: Colors.brand_primary,
  },
  cardContainerInactive: {
    opacity: 0.6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderColor: 'rgba(255,255,255,0.05)',
  },
  removeBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 22,
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
  inactiveBtn: {
    backgroundColor: Colors.red_400 + '30',
  },
});
