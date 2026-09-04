import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useOrganizerDashboard } from '@/presentation/hooks/dashboard/useOrganizerDashboard';
import { Colors } from '@/presentation/styles';
import { CustomFormView } from '@/presentation/theme/components/CustomFormView';
import { OrganizerBrandOnboarding } from './OrganizerBrandOnboarding';
import { OrganizerBrandsSection } from './OrganizerBrandsSection';
import { OrganizerKPIsGrid } from './OrganizerKPIsGrid';
import { OrganizerShortcutsGrid } from './OrganizerShortcutsGrid';
import { OrganizerTournamentsSection } from './OrganizerTournamentsSection';

export const OrganizerDashboardView = () => {
  const {
    userName,
    brands,
    myEditions,
    isLoading,
    totalBrands,
    totalTournaments,
    totalMatches,
    totalGoals,
    handleCreateBrand,
    handleCreateTournament,
    handlePressBrand,
    handleNavigateToBrandsTab,
    handleNavigateToCalendar,
  } = useOrganizerDashboard();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.brand_primary} />
      </View>
    );
  }

  return (
    <CustomFormView>
      {brands.length === 0 ? (
        <OrganizerBrandOnboarding userName={userName} onCreateBrand={handleCreateBrand} />
      ) : (
        /* Active State: Has Brands */
        <View style={styles.dashboardContent}>
          <View style={styles.header}>
            <Text style={styles.title}>¡Hola, {userName}! 👋</Text>
            <Text style={styles.subtitle}>Así van tus torneos y competencias</Text>
          </View>

          <OrganizerKPIsGrid
            totalBrands={totalBrands}
            totalTournaments={totalTournaments}
            totalMatches={totalMatches}
            totalGoals={totalGoals}
          />

          {/* Quick Actions Shortcuts */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
          </View>

          <OrganizerShortcutsGrid
            onCreateTournament={handleCreateTournament}
            onCreateBrand={handleCreateBrand}
            onNavigateToBrands={handleNavigateToBrandsTab}
            onNavigateToCalendar={handleNavigateToCalendar}
          />

          {/* SECCIÓN PRINCIPAL: MIS TORNEOS */}
          <OrganizerTournamentsSection
            myEditions={myEditions}
            hasBrands={brands.length > 0}
            onCreateTournament={handleCreateTournament}
          />

          {/* SECCIÓN SECUNDARIA: MIS MARCAS */}
          <OrganizerBrandsSection
            brands={brands}
            onPressBrand={handlePressBrand}
            onPressSeeAll={handleNavigateToBrandsTab}
          />
        </View>
      )}
    </CustomFormView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface_base,
    minHeight: '100%',
  },
  dashboardContent: {
    // paddingBottom: 20,
  },
  header: {
    marginTop: 0,
    paddingTop: 8,
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text_primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text_tertiary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
});
