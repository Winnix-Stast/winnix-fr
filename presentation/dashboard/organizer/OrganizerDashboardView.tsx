import React, { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { BrandTutorialOverlay } from '@/presentation/components/tutorials';
import { useMyTournaments } from '@/presentation/hooks/tournaments/useMyTournaments';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';
import { Fonts } from '@/presentation/styles/global-styles';
import { BrandCard3D } from '@/presentation/tournamentsView/shared/BrandCard3D';
import { OrganizerBrandOnboarding } from './OrganizerBrandOnboarding';
import { OrganizerKPIsGrid } from './OrganizerKPIsGrid';
import { OrganizerShortcutsGrid } from './OrganizerShortcutsGrid';

export const OrganizerDashboardView = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { tournaments: brands, loading, isRefreshing, refresh } = useMyTournaments();
  const [forceShowTutorial, setForceShowTutorial] = useState(false);

  const userName = user?.username || '';
  console.log('user :>> ', user);

  const handleCreateBrand = () => {
    router.push('/winnix/brand/create');
  };

  const handlePressBrand = (item: any) => {
    router.push(`/winnix/brand/${item._id}`);
  };

  const handleNavigateToBrandsTab = () => {
    router.push('/winnix/myZone/organizer/brands');
  };

  const handleNavigateToCalendar = () => {
    router.push('/winnix/tabs/calendar');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.brand_primary} />
      </View>
    );
  }

  // Calculate global aggregate statistics
  const totalBrands = brands.length;
  const totalTournaments = brands.reduce(
    (acc, b) => acc + (b.globalStats?.totalEditions ?? 0),
    0,
  );
  const totalMatches = brands.reduce(
    (acc, b) => acc + (b.globalStats?.totalMatchesPlayed ?? 0),
    0,
  );
  const totalGoals = brands.reduce((acc, b) => acc + (b.globalStats?.totalGoals ?? 0), 0);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          colors={[Colors.brand_primary]}
          tintColor={Colors.brand_primary}
        />
      }
    >
      {brands.length === 0 ? (
        <OrganizerBrandOnboarding
          userName={userName}
          onCreateBrand={handleCreateBrand}
          onShowTutorial={() => setForceShowTutorial(true)}
        />
      ) : (
        /* Active State: Has Brands */
        <View style={styles.dashboardContent}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.title}>¡Hola, {userName}! 👋</Text>
              <TouchableOpacity
                style={styles.helpButton}
                onPress={() => setForceShowTutorial(true)}
                activeOpacity={0.7}
              >
                <WinnixIcon
                  name='help-circle-outline'
                  size={22}
                  color={Colors.brand_primary}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>Así van mis torneos y partidos</Text>
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
            onCreateBrand={handleCreateBrand}
            onNavigateToBrands={handleNavigateToBrandsTab}
            onNavigateToCalendar={handleNavigateToCalendar}
          />

          {/* Active Brands list */}
          <View style={[styles.sectionHeader, { marginTop: 28, marginBottom: 10 }]}>
            <Text style={styles.sectionTitle}>Mis Marcas Activas</Text>
            <TouchableOpacity onPress={handleNavigateToBrandsTab}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.brandsListWrapper}>
            {brands.slice(0, 5).map((item: any) => (
              <BrandCard3D
                key={item._id}
                id={item._id}
                name={item.name}
                logo={item.logo}
                isActive={item.isActive}
                totalEditions={item.globalStats?.totalEditions || 0}
                totalMatches={item.globalStats?.totalMatchesPlayed || 0}
                averageRating={item.averageRating || 0}
                onPress={() => handlePressBrand(item)}
              />
            ))}
          </View>
        </View>
      )}

      {/* Tutorial contextual de Marcas */}
      <BrandTutorialOverlay
        forceShow={forceShowTutorial}
        onClose={() => setForceShowTutorial(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface_base,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface_base,
  },
  dashboardContent: {
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  subtitle: {
    fontSize: Fonts.normal,
    color: Colors.text_tertiary,
  },
  helpButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(40, 209, 195, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.15)',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.brand_primary,
    fontWeight: '600',
  },

  brandsListWrapper: {
    paddingHorizontal: 20,
  },
});
