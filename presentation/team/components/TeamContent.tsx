import { StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TeamMatches } from './teamContent/tabs/TeamMatches';
import { TeamPlayers } from './teamContent/tabs/TeamPlayers';
import { TeamSponsors } from './teamContent/tabs/TeamSponsors';
import { TeamStats } from './teamContent/tabs/TeamStats';
import { TeamTournaments } from './teamContent/tabs/TeamTournaments';
import { TeamContentProps } from './teamContent/types';

export const TeamContent = ({
  team,
  activeTab,
  router,
  isEditing,
  isCaptain,
  refresh,
  members,
  loadingMembers,
  fetchNextMembersPage,
  hasNextMembersPage,
  isFetchingNextMembersPage,
  toggleMemberStatus,
  isTogglingMember,
}: TeamContentProps) => {
  return (
    <Animated.View
      key={activeTab}
      entering={FadeInDown.duration(400).springify()}
      style={styles.tabContent}
    >
      {activeTab === 'stats' && <TeamStats team={team} />}
      {activeTab === 'players' && (
        <TeamPlayers
          team={team}
          members={members}
          activeTab={activeTab}
          router={router}
          isEditing={isEditing}
          isCaptain={isCaptain}
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

const styles = StyleSheet.create({
  tabContent: {
    minHeight: 350,
  },
});
