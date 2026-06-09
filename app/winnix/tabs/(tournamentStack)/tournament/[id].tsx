import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTournamentDetails } from '@/presentation/hooks/tournaments/useTournamentDetails';
import { IconName, WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { Flex, Fonts } from '@/presentation/styles/global-styles';
import { CustomFormView } from '@/presentation/theme/components/CustomFormView';
import { CustomText } from '@/presentation/theme/components/CustomText';
import {
  BracketLayout,
  InformationTournament,
  ResumeLayout,
  TournamentTeamsLayout,
} from '@/presentation/tournamentsView';
import { TournamentHeaderCard } from '@/presentation/tournamentsView/tournamentsInfo/TournamentHeaderCard';
import { TournamentMenu } from '@/presentation/tournamentsView/tournamentsInfo/TournamentMenu';
import { TournamentStatsCards } from '@/presentation/tournamentsView/tournamentsInfo/TournamentStatsCards';
import { TournamentStagesLayout } from '@/presentation/tournamentsView/tournamentsInfo/stagesLayout';
import { RosterLayout } from '@/presentation/tournamentsView/tournamentsInfo/rosterLayout/RosterLayout';

const TournamentDetails = () => {
  const { id } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  const details = useTournamentDetails(id as string, router);

  const menuItems = [
    { key: 'summary', label: 'Resumen', icon: 'folder-open-outline' as IconName },
    { key: 'stages', label: 'Etapas', icon: 'flag-outline' as IconName },
    { key: 'teams', label: 'Equipos', icon: 'people-outline' as IconName },
    { key: 'bracket', label: 'Llaves', icon: 'git-network-outline' as IconName },
    { key: 'info', label: 'Info', icon: 'information-circle-outline' as IconName },
  ];

  if (details.isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.surface_screen,
        }}
      >
        <ActivityIndicator size='large' color={Colors.brand_primary} />
      </View>
    );
  }

  if (!details.edition) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.surface_screen,
        }}
      >
        <CustomText label='No se encontró el torneo' color={Colors.text_primary} />
      </View>
    );
  }

  const filteredMenuItems = menuItems.filter(
    (item) => item.key !== 'stages' || details.isOrganizer
  );
  
  if (details.isCaptain && details.isAlreadyInscribed) {
    if (!filteredMenuItems.some((item) => item.key === 'my_team')) {
      filteredMenuItems.unshift({
        key: 'my_team',
        label: 'Mi Equipo',
        icon: 'shirt-outline' as IconName,
      });
    }
  }

  return (
    <CustomFormView>
      <ScrollView>
        <View style={{ ...Flex.columnCenter, gap: 12, padding: 15 }}>
          <Pressable
            onPress={details.handleGoBack}
            style={[
              styles.back,
              {
                top: top - 30,
              },
            ]}
          >
            <WinnixIcon
              name={'chevron-back-outline'}
              size={30}
              color={Colors.text_primary}
            />
          </Pressable>

          {details.tournamentData && (
            <TournamentHeaderCard
              key={details.tournamentData.id}
              title={details.tournamentData.title}
              state={details.tournamentData.state}
              dateText={details.tournamentData.dateText}
              image={details.tournamentData.image}
              titleStyle={{ fontSize: 32 }}
            />
          )}

          {/* Cards teams and reward */}
          <TournamentStatsCards
            inscriptionsCount={details.edition.inscriptions?.length || 0}
            status={details.edition.status}
            statusLabel={details.statusMap[details.edition.status] || details.edition.status}
          />

          <TournamentMenu
            activeKey={details.activeTab}
            onSelect={(key) => details.handleChangeView(key)}
            items={filteredMenuItems}
          />

          {/* Section Mi Equipo */}
          {details.activeTab === 'my_team' && (
            <RosterLayout
              members={details.members}
              loadingMembers={details.loadingMembers}
              selectedPlayers={details.selectedPlayers}
              jerseyNumbers={details.jerseyNumbers}
              isSavingRoster={details.isSavingRoster}
              playersPerTeam={details.edition.playersPerTeam}
              handleTogglePlayer={details.handleTogglePlayer}
              handleJerseyNumberChange={details.handleJerseyNumberChange}
              handleSaveRoster={details.handleSaveRoster}
            />
          )}

          {/* Section View Summary */}
          {details.activeTab === 'summary' && (
            <ResumeLayout
              stats={details.statsData}
              activities={details.recentActivities}
              showParticipation={details.showParticipation}
              onInscribe={details.handleParticipationAction}
              participationProps={details.getParticipationProps()}
            />
          )}

          {/* Section Stages */}
          {details.activeTab === 'stages' && (
            <TournamentStagesLayout
              editionId={id as string}
              isOrganizer={!!details.isOrganizer}
            />
          )}

          {/* Section teams */}
          {details.activeTab === 'teams' && (
            <TournamentTeamsLayout
              inscriptions={details.inscriptions}
              playersPerTeam={details.edition?.playersPerTeam}
            />
          )}

          {/* Section Bracket */}
          {details.activeTab === 'bracket' && (
            <BracketLayout matches={details.matches} upcomingMatches={details.upcomingMatches} />
          )}

          {details.activeTab === 'info' && <InformationTournament />}
        </View>
      </ScrollView>
    </CustomFormView>
  );
};

export default TournamentDetails;

const styles = StyleSheet.create({
  back: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    elevation: 10,
  },

  nameTournament: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.text_primary,
    textAlign: 'center',
    top: -30,
  },

  contentOptions: {
    width: '90%',
    marginHorizontal: 'auto',
    top: -15,
  },

  optionsTitle: {
    fontSize: Fonts.large,
    marginRight: 20,
  },

  contentView: {
    width: '90%',
    marginHorizontal: 'auto',
    marginVertical: 10,
  },

  icon: {
    padding: 10,
    borderRadius: 12,
  },
});
