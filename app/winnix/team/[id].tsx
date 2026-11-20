import { useTeam } from '@/presentation/hooks/teams/useTeam';
import { Colors } from '@/presentation/styles/colors';
import { TeamContent } from '@/presentation/team/components/TeamContent';
import { TeamDeleteModal } from '@/presentation/team/components/TeamDeleteModal';
import { TeamHUDTabs } from '@/presentation/team/components/TeamHUDTabs';
import { TeamHero } from '@/presentation/team/components/TeamHero';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

export default function TeamDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    team,
    loading,
    error,
    refresh,

    // Role state
    isCaptain,
    isMember,
    isInactiveMember,
    isPendingInvitation,
    isPendingJoinRequest,
    hasPendingRequests,

    // Tabs & UI Mode
    activeTab,
    handleTabPress,

    // Join / Leave Actions
    hasRequestedJoin,
    isSubmittingJoin,
    isSubmittingLeave,
    handleRequestJoin,
    handleLeaveTeam,
    handleToggleFavorite,
    handleRespondInvitation,
    isRespondingInvitation,

    // Delete Modal logic
    isDeleteModalVisible,
    setIsDeleteModalVisible,
    openDeleteModal,
    handleDeleteConfirm,
    isDeleting,

    // Members Pagination & Actions
    members,
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
  } = useTeam(id as string);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 80], [0, 1]),
      transform: [{ translateY: interpolate(scrollY.value, [0, 80], [10, 1]) }],
    };
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.brand_primary} />
        <Text style={styles.loadingText}>INICIALIZANDO SISTEMAS...</Text>
      </View>
    );
  }

  if (error || !team) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name='warning' size={64} color={Colors.text_error} />
        <Text style={styles.errorText}>
          {error || 'Error de conexión con el núcleo'}
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>REINTENTAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.permanentHeader}>
        <TouchableOpacity
          style={styles.simpleBackBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons name='chevron-back' size={28} color={Colors.brand_primary} />
        </TouchableOpacity>

        {/* Action icons only visible for Team Captains */}
        {isCaptain && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(`/winnix/team/edit?id=${team._id}`);
              }}
              style={styles.headerBtn}
            >
              <Ionicons name='create-outline' size={20} color={Colors.brand_primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                openDeleteModal();
              }}
              style={styles.headerBtn}
            >
              <Ionicons name='trash-outline' size={20} color={Colors.red_400} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Dynamic Header (Title & Background) */}
      <Animated.View style={[styles.stickyHeader, headerStyle]}>
        <View style={styles.blurInner}>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {team.name.toUpperCase()}{' '}
              <Text style={styles.idText}>
                #{String(team.incremental || 0).padStart(3, '0')}
              </Text>
            </Text>
            <View style={styles.headerLine} />
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TeamHero
          team={team}
          onToggleFavorite={handleToggleFavorite}
          isEditing={false}
          isCaptain={isCaptain}
          isMember={isMember}
          isInactiveMember={isInactiveMember}
          isPendingInvitation={isPendingInvitation}
          isPendingJoinRequest={isPendingJoinRequest}
          isRespondingInvitation={isRespondingInvitation}
          onRespondInvitation={handleRespondInvitation}
          hasRequestedJoin={hasRequestedJoin}
          isSubmittingJoin={isSubmittingJoin}
          isSubmittingLeave={isSubmittingLeave}
          onJoinRequest={handleRequestJoin}
          onLeaveRequest={handleLeaveTeam}
        />

        <TeamHUDTabs
          activeTab={activeTab}
          hasPendingPlayers={hasPendingRequests}
          onTabPress={handleTabPress}
        />

        <TeamContent
          team={team}
          activeTab={activeTab}
          router={router}
          isEditing={false}
          isCaptain={Boolean(isCaptain)}
          refresh={refresh}
          // Members Props
          members={members}
          loadingMembers={loadingMembers}
          fetchNextMembersPage={fetchNextMembersPage}
          hasNextMembersPage={hasNextMembersPage}
          isFetchingNextMembersPage={isFetchingNextMembersPage}
          toggleMemberStatus={toggleMemberStatus}
          isTogglingMember={isTogglingMember}
          handleDeactivateMember={handleDeactivateMember}
          handleReactivateMember={handleReactivateMember}
          handleRemoveMember={handleRemoveMember}
          isRemovingMember={isRemovingMember}
        />

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Team Delete Confirmation Modal */}
      <TeamDeleteModal
        visible={isDeleteModalVisible}
        teamName={team?.name || ''}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.on_brand,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.on_brand,
  },
  loadingText: {
    marginTop: 20,
    color: Colors.brand_primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    zIndex: 100,
    backgroundColor: 'rgba(3, 8, 25, 0.98)',
    borderBottomWidth: 2,
    borderBottomColor: Colors.brand_primary,
  },
  permanentHeader: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 90,
    zIndex: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  blurInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerBtnActive: {
    borderColor: Colors.brand_primary,
    backgroundColor: 'rgba(40, 209, 195, 0.2)',
  },
  headerTitle: {
    color: Colors.brand_primary,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  idText: {
    fontSize: 12,
    color: Colors.text_tertiary,
    fontWeight: '400',
  },
  headerLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.brand_primary,
    marginTop: 4,
  },
  simpleBackBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  backBtn: {
    marginTop: 20,
    paddingHorizontal: 25,
    paddingVertical: 12,
    backgroundColor: Colors.brand_primary,
  },
  backBtnText: {
    color: '#000',
    fontWeight: '900',
    letterSpacing: 2,
  },
});
