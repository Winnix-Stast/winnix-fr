import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTournamentDetails } from '@/presentation/hooks/tournaments/useTournamentDetails';
import { IconName, WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';
import { Fonts } from '@/presentation/styles/global-styles';
import { CustomButton } from '@/presentation/theme/components/CustomButton';
import { AppModal as CustomModal } from '@/presentation/theme/components/CustomModal';
import { CustomText } from '@/presentation/theme/components/CustomText';
import {
  BracketLayout,
  InformationTournament,
  ResumeLayout,
  TournamentTeamsLayout,
} from '@/presentation/tournamentsView';
import { TournamentInscriptionModal } from '@/presentation/tournamentsView/components/TournamentInscriptionModal';
import { TournamentHeaderCard } from '@/presentation/tournamentsView/tournamentsInfo/TournamentHeaderCard';
import { TournamentMenu } from '@/presentation/tournamentsView/tournamentsInfo/TournamentMenu';
import { TournamentStatsCards } from '@/presentation/tournamentsView/tournamentsInfo/TournamentStatsCards';
import { InfoRewards } from '@/presentation/tournamentsView/tournamentsInfo/information/rewards/InfoRewards';
import { TournamentCaptainSection } from '@/presentation/tournamentsView/tournamentsInfo/views/TournamentCaptainSection';
import { TournamentOrganizerSection } from '@/presentation/tournamentsView/tournamentsInfo/views/TournamentOrganizerSection';

const TournamentDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const details = useTournamentDetails(id as string, router);

  const menuItems = [
    { key: 'summary', label: 'Resumen', icon: 'folder-open-outline' as IconName },
    { key: 'prizes', label: 'Premios', icon: 'trophy-outline' as IconName },
    { key: 'bracket', label: 'Llaves', icon: 'git-network-outline' as IconName },
    { key: 'stages', label: 'Etapas', icon: 'flag-outline' as IconName },
    { key: 'teams', label: 'Equipos', icon: 'people-outline' as IconName },
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
    (item) => item.key !== 'stages' || details.isOrganizer,
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
    <View style={{ flex: 1, backgroundColor: Colors.surface_screen }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          alignItems: 'center',
          gap: 12,
          padding: 15,
          paddingBottom: 100,
        }}
        style={{ flex: 1 }}
      >
        {details.tournamentData && (
          <TournamentHeaderCard
            key={details.tournamentData.id}
            title={details.tournamentData.title}
            state={details.tournamentData.state}
            statusLabel={
              details.statusMap[details.edition.status] || details.edition.status
            }
            dateText={details.tournamentData.dateText}
            image={details.tournamentData.image}
            onBack={details.handleGoBack}
            titleStyle={{ fontSize: 32 }}
          />
        )}

        {details.isOrganizer && details.edition.status === 'DRAFT' && (
          <Pressable
            style={styles.startTournamentButton}
            onPress={details.handleStartTournament}
          >
            <WinnixIcon name='play-outline' size={20} color={Colors.status_draft} />
            <CustomText
              label='Empezar Torneo'
              color={Colors.status_draft}
              weight='bold'
            />
          </Pressable>
        )}

        {/* Cards teams and players */}
        <TournamentStatsCards
          inscriptionsCount={details.inscriptions?.length || 0}
          playersCount={details.totalPlayersCount}
        />

        <TournamentMenu
          activeKey={details.activeTab}
          onSelect={(key) => details.handleChangeView(key)}
          items={filteredMenuItems}
        />

        {/* Section Mi Equipo */}
        {details.activeTab === 'my_team' && (
          <TournamentCaptainSection
            members={details.members}
            loadingMembers={details.loadingMembers}
            selectedPlayers={details.selectedPlayers}
            jerseyNumbers={details.jerseyNumbers}
            isSavingRoster={details.isSavingRoster}
            playersPerTeam={details.edition?.playersPerTeam}
            handleTogglePlayer={details.handleTogglePlayer}
            handleJerseyNumberChange={details.handleJerseyNumberChange}
            handleSaveRoster={details.handleSaveRoster}
          />
        )}

        {/* Section Summary */}
        {details.activeTab === 'summary' && (
          <ResumeLayout
            stats={details.statsData}
            activities={details.recentActivities}
            showParticipation={details.showParticipation}
            onInscribe={details.handleParticipationAction}
            participationProps={details.getParticipationProps()}
          />
        )}

        {/* Section Prizes */}
        {details.activeTab === 'prizes' && (
          <InfoRewards editionId={id as string} isOrganizer={!!details.isOrganizer} />
        )}

        {/* Section Bracket */}
        {details.activeTab === 'bracket' && (
          <BracketLayout
            matches={details.matches}
            upcomingMatches={details.upcomingMatches}
          />
        )}

        {/* Section Stages */}
        {details.activeTab === 'stages' && (
          <TournamentOrganizerSection
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

        {/* Section Info */}
        {details.activeTab === 'info' && (
          <InformationTournament
            edition={details.edition}
            isOrganizer={!!details.isOrganizer}
          />
        )}
      </ScrollView>

      {/* FAB de Edición para Organizador */}
      {details.isOrganizer && (
        <View style={styles.fabContainer}>
          <Pressable
            style={styles.fabEdit}
            onPress={() => router.push(`/winnix/tournament/edit?id=${id}`)}
          >
            <WinnixIcon name='pencil-outline' size={24} color={Colors.brand_primary} />
          </Pressable>
        </View>
      )}

      {/* Modal de Confirmación de Iniciar Torneo */}
      <CustomModal
        visible={details.isConfirmModalVisible}
        onClose={() => details.setIsConfirmModalVisible(false)}
        iconColor={Colors.text_primary}
        contentStyle={{ backgroundColor: Colors.surface_base, padding: 20 }}
      >
        <View style={{ alignItems: 'center', gap: 15, paddingVertical: 10 }}>
          <WinnixIcon name='alert-circle-outline' size={50} color={Colors.status_draft} />
          <CustomText
            label='¿Empezar Torneo?'
            weight='bold'
            size={20}
            color={Colors.text_primary}
          />
          <CustomText
            label='Esta acción cambiará el estado del torneo a Inscripciones Abiertas. Los equipos podrán empezar a inscribirse.'
            color={Colors.text_secondary}
            style={{ textAlign: 'center' }}
          />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10, width: '100%' }}>
            <CustomButton
              label='Cancelar'
              outline
              onPress={() => details.setIsConfirmModalVisible(false)}
              stylePressable={{ flex: 1 }}
            />
            <CustomButton
              label='Iniciar'
              onPress={details.confirmStartTournament}
              disabled={details.isStartingTournament}
              stylePressable={{ flex: 1 }}
            />
          </View>
        </View>
      </CustomModal>

      {/* Modal de Éxito */}
      <CustomModal
        visible={details.isSuccessModalVisible}
        onClose={() => details.setIsSuccessModalVisible(false)}
        iconColor={Colors.text_primary}
        contentStyle={{ backgroundColor: Colors.surface_base, padding: 20 }}
      >
        <View style={{ alignItems: 'center', gap: 15, paddingVertical: 10 }}>
          <WinnixIcon
            name='checkmark-circle-outline'
            size={50}
            color={Colors.green_400}
          />
          <CustomText
            label='¡Torneo iniciado!'
            weight='bold'
            size={20}
            color={Colors.text_primary}
          />
          <CustomText
            label='El torneo ha pasado a estado de Inscripciones Abiertas exitosamente.'
            color={Colors.text_secondary}
          />
          <CustomButton
            label='Entendido'
            onPress={() => details.setIsSuccessModalVisible(false)}
            stylePressable={{ marginTop: 20, width: '100%' }}
          />
        </View>
      </CustomModal>

      {/* Modal de Inscripción al Torneo */}
      <TournamentInscriptionModal
        visible={details.isInscriptionModalVisible}
        editionId={id as string}
        editionName={details.tournamentData?.title || 'Torneo'}
        playersPerTeam={details.edition?.playersPerTeam}
        teams={details.teams || []}
        onClose={() => details.setIsInscriptionModalVisible(false)}
        onSuccess={async () => {
          await details.refetchInscriptions();
          details.handleChangeView('my_team');
        }}
      />
    </View>
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

  fabContainer: {
    position: 'absolute',
    bottom: 40,
    right: 25,
    zIndex: 100,
    elevation: 10,
  },
  startTournamentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface_elevated,
    borderWidth: 1,
    borderColor: Colors.status_draft,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    width: '100%',
  },
  fabEdit: {
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    borderWidth: 1,
    borderColor: Colors.brand_primary,
    padding: 14,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'center',
    alignItems: 'center',
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
