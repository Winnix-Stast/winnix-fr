import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandTutorialOverlay } from '@/presentation/components/tutorials';
import { useMyTournaments } from '@/presentation/hooks/tournaments/useMyTournaments';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';
import { Fonts } from '@/presentation/styles/global-styles';
import { CustomIcon } from '@/presentation/theme/components/icons/CustomIcon';
import OurTournamentsList from '@/presentation/tournamentsView/shared/OurTournamentsList';

export const OrganizerDashboardView = () => {
  const router = useRouter();
  const { tournaments: brands, loading, isRefreshing, refresh } = useMyTournaments();
  const [forceShowTutorial, setForceShowTutorial] = useState(false);

  const handleCreateTournament = () => {
    router.push('/winnix/brand/create');
  };

  const handlePressTournament = (item: any) => {
    router.push(`/winnix/myZone/organizer/brands/${item._id}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.brand_primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.title}>Mis Marcas</Text>
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
        <Text style={styles.subtitle}>Gestiona tus competiciones activas</Text>
      </View>

      {brands.length > 0 ? (
        <OurTournamentsList
          tournaments={brands}
          refreshing={isRefreshing}
          onRefresh={refresh}
          onPressItem={handlePressTournament}
          isBrandList={true}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <View style={styles.iconWrapper}>
            <CustomIcon name='empty-tournament' size={300} />
          </View>
          <Text style={styles.emptyTitle}>Ninguna marca activa</Text>
          <Text style={styles.emptySubtitle}>
            La arena está vacía. Es hora de crear tu marca y empezar a armar tus propios
            torneos y temporadas.
          </Text>

          <TouchableOpacity
            style={styles.createButton}
            activeOpacity={0.8}
            onPress={handleCreateTournament}
          >
            <Text style={styles.createButtonText}>CREAR MARCA</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botón flotante siempre visible si hay marcas */}
      {brands.length > 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleCreateTournament}
          activeOpacity={0.9}
        >
          <CustomIcon name='plus' size={30} color={Colors.on_brand} />
        </TouchableOpacity>
      )}

      {/* Tutorial contextual de Marcas */}
      <BrandTutorialOverlay
        forceShow={forceShowTutorial}
        onClose={() => setForceShowTutorial(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface_base,
    paddingVertical: 20,
  },
  header: {
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  helpButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(40, 209, 195, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.15)',
  },
  subtitle: {
    fontSize: Fonts.normal,
    color: Colors.text_tertiary,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
  },
  iconWrapper: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text_brand,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Fonts.normal,
    color: Colors.text_tertiary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  createButton: {
    backgroundColor: Colors.actions_primary_bg,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  createButtonText: {
    color: Colors.on_brand,
    fontSize: Fonts.normal,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface_base,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.actions_primary_bg,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
});
