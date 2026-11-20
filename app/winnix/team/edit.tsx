import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenHeader } from '@/presentation/components/customs';
import { useEditTeam } from '@/presentation/hooks/teams/useEditTeam';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';
import {
  TeamEditLogoSection,
  TeamEditRosterSection,
  TeamEditSettingsSection,
  TeamEditStatsSection,
  TeamEditTabBar,
} from '@/presentation/team/components/edit';
import { CustomFormView } from '@/presentation/theme/components';

export default function EditTeamScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    activeTab,
    setActiveTab,
    team,
    members,
    isLoading,
    errorMsg,
    control,
    handleSubmit,
    errors,
    isSavingGeneral,
    isSavingVisual,
    isTogglingMember,
    onSubmitGeneral,
    onSubmitVisual,
    handleToggleMember,
    handleRemoveMember,
    handleGoBack,
    captainName,
    sportName,
    incrementalId,
    stats,
    goalDifference,

    // Búsqueda y Reclutamiento integrado
    searchTerm,
    setSearchTerm,
    isSearchingPlayer,
    searchedPlayer,
    hasSearchedPlayer,
    isRecruiting,
    handleSearchPlayer,
    handleRecruitPlayer,
    handleResetSearch,
  } = useEditTeam(id || '');

  if (isLoading || (!team && !errorMsg)) {
    return (
      <CustomFormView>
        <ScreenHeader title='Editar Equipo' onBack={handleGoBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.brand_primary} />
          <Text style={styles.loadingText}>CARGANDO DATOS DEL EQUIPO...</Text>
        </View>
      </CustomFormView>
    );
  }

  if (errorMsg || !team) {
    return (
      <CustomFormView>
        <ScreenHeader title='Editar Equipo' onBack={handleGoBack} />
        <View style={styles.loadingContainer}>
          <WinnixIcon
            name='alert-circle-outline'
            size={50}
            color={Colors.status_cancelled}
          />
          <Text style={styles.errorText}>
            {errorMsg || 'No se pudo cargar la información del equipo.'}
          </Text>
        </View>
      </CustomFormView>
    );
  }

  return (
    <CustomFormView>
      {/* Cabecera oficial del Design System */}
      <ScreenHeader title='Editar Equipo' onBack={handleGoBack} />

      {/* Barra de Pestañas Modular */}
      <TeamEditTabBar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Contenido de la Sección Activa */}
      <View style={styles.contentContainer}>
        {activeTab === 'ajustes' && (
          <TeamEditSettingsSection
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
            isSavingGeneral={isSavingGeneral}
            onSubmitGeneral={onSubmitGeneral}
            sportName={sportName}
            captainName={captainName}
            incrementalId={incrementalId}
          />
        )}

        {activeTab === 'multimedia' && (
          <TeamEditLogoSection
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
            isSavingVisual={isSavingVisual}
            onSubmitVisual={onSubmitVisual}
          />
        )}

        {activeTab === 'jugadores' && (
          <TeamEditRosterSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isSearchingPlayer={isSearchingPlayer}
            searchedPlayer={searchedPlayer}
            hasSearchedPlayer={hasSearchedPlayer}
            isRecruiting={isRecruiting}
            handleSearchPlayer={handleSearchPlayer}
            handleRecruitPlayer={handleRecruitPlayer}
            handleResetSearch={handleResetSearch}
            members={members}
            isTogglingMember={isTogglingMember}
            handleRemoveMember={handleRemoveMember}
            handleToggleMember={handleToggleMember}
          />
        )}

        {activeTab === 'info' && (
          <TeamEditStatsSection
            stats={stats}
            goalDifference={goalDifference}
          />
        )}
      </View>
    </CustomFormView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
    minHeight: 300,
  },
  loadingText: {
    color: Colors.brand_primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  errorText: {
    fontSize: 15,
    color: Colors.text_secondary,
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
