import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTournamentDetails } from '@/presentation/hooks/tournaments/useTournamentDetails';
import { IconName, WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';
import { Flex, Fonts } from '@/presentation/styles/global-styles';
import { CustomButton } from '@/presentation/theme/components/CustomButton';
import { CustomFormView } from '@/presentation/theme/components/CustomFormView';
import { AppModal as CustomModal } from '@/presentation/theme/components/CustomModal';
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
import { TournamentCaptainSection } from '@/presentation/tournamentsView/tournamentsInfo/views/TournamentCaptainSection';
import { TournamentOrganizerSection } from '@/presentation/tournamentsView/tournamentsInfo/views/TournamentOrganizerSection';

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
      <CustomFormView>
          <View style={{ ...Flex.columnCenter, gap: 12, padding: 15, paddingBottom: 100 }}>
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
                statusLabel={
                  details.statusMap[details.edition.status] || details.edition.status
                }
                dateText={details.tournamentData.dateText}
                image={details.tournamentData.image}
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

            {/* Cards teams and reward */}
            <TournamentStatsCards
              inscriptionsCount={details.edition.inscriptions?.length || 0}
              status={details.edition.status}
              statusLabel={
                details.statusMap[details.edition.status] || details.edition.status
              }
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

            {/* Section Bracket */}
            {details.activeTab === 'bracket' && (
              <BracketLayout
                matches={details.matches}
                upcomingMatches={details.upcomingMatches}
              />
            )}

            {details.activeTab === 'info' && (
              <InformationTournament
                edition={details.edition}
                isOrganizer={!!details.isOrganizer}
              />
            )}
          </View>
      </CustomFormView>

      {details.isOrganizer && (
        <View style={styles.fabContainer}>
          <Pressable
            onPress={() => {
              router.push({
                pathname: '/winnix/tournament/edit',
                params: { id: id as string },
              });
            }}
            style={styles.fabEdit}
          >
            <WinnixIcon name='pencil-outline' size={24} color={Colors.brand_primary} />
          </Pressable>
        </View>
      )}

      {/* Modal de Confirmación */}
      <CustomModal
        visible={details.isConfirmModalVisible}
        onClose={() => details.setIsConfirmModalVisible(false)}
        iconColor={Colors.text_primary}
        contentStyle={{ backgroundColor: Colors.surface_base, padding: 20 }}
      >
        <View style={{ alignItems: 'center', gap: 15, paddingVertical: 10 }}>
          <WinnixIcon name='warning-outline' size={50} color={Colors.status_draft} />
          <CustomText
            label='¿Deseas iniciar el torneo?'
            weight='bold'
            size={20}
            color={Colors.text_primary}
          />
          <CustomText
            label="Esta acción cambiará el estado a 'Inscripciones Abiertas' y no se puede revertir."
            color={Colors.text_secondary}
          />
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <CustomButton
              label='Cancelar'
              onPress={() => details.setIsConfirmModalVisible(false)}
              outline={true}
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
