import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { usePermission } from '@/presentation/hooks/auth/usePermission';
import { useMyBrands } from '@/presentation/hooks/brands/useMyBrands';
import { useMyInscriptions } from '@/presentation/hooks/inscriptions/useMyInscriptions';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors, Fonts } from '@/presentation/styles/global-styles';
import { PermissionGate } from '@/presentation/theme/components';
import { MainContainerView } from '@/presentation/theme/components/MainContainerView';
import { CustomIcon } from '@/presentation/theme/components/icons/CustomIcon';
import OurTournamentsList from '@/presentation/tournamentsView/ourTournaments/OurTournamentsList';

const OurTournaments = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { can } = usePermission();
  
  const { brands, loading: loadingBrands, isRefreshing: refreshingBrands, refresh: refreshBrands } = useMyBrands();
  const { inscriptions, loading: loadingInscriptions, isRefreshing: refreshingInscriptions, refresh: refreshInscriptions } = useMyInscriptions();

  const isOrganizer = can('create:tournament');

  const loading = isOrganizer ? loadingBrands : loadingInscriptions;
  const isRefreshing = isOrganizer ? refreshingBrands : refreshingInscriptions;
  const refresh = isOrganizer ? refreshBrands : refreshInscriptions;

  React.useEffect(() => {
    navigation.setOptions({ title: isOrganizer ? 'Mis Marcas 2' : 'Mis Torneos' });
  }, [navigation, isOrganizer]);

  const handleCreateTournament = () => {
    router.push('/winnix/tournament/create');
  };

  const listItems = isOrganizer
    ? brands
    : inscriptions.map((ins: any) => ({
        _id: ins._id,
        name: `${ins.tournamentEdition?.tournament?.name || 'Torneo'} — ${ins.tournamentEdition?.seasonName || 'Edición'}`,
        logo: ins.tournamentEdition?.tournament?.logo || ins.team?.logo,
        isActive: ins.tournamentEdition?.status === 'ACTIVE' || ins.isActive,
        stats: [
          {
            _id: `${ins._id}-team`,
            iconName: 'people-outline' as const,
            title: 'Equipo',
            value: ins.team?.name || '—',
            iconColor: Colors.primary,
            flexText: true,
          },
          {
            _id: `${ins._id}-won`,
            iconName: 'trophy-outline' as const,
            title: 'Ganados',
            value: String(ins.stats?.matchesWon || 0),
            iconColor: '#FBBF24',
          },
        ],
        styleText: { fontSize: 16 },
        editionId: ins.tournamentEdition?._id,
      }));

  const handlePressItem = (item: any) => {
    if (isOrganizer) {
      router.push(`/winnix/ourTournaments/${item._id}`);
    } else {
      if (item.editionId) {
        router.push(`/winnix/ourTournaments/tournament/${item.editionId}`);
      }
    }
  };

  if (loading) {
    return (
      <MainContainerView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.primary} />
        </View>
      </MainContainerView>
    );
  }

  return (
    <MainContainerView>
      {/* FAB - Create Tournament */}
      <PermissionGate permission='create:tournament'>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreateTournament}
          activeOpacity={0.9}
        >
          <WinnixIcon name='add-outline' size={35} />
        </TouchableOpacity>
      </PermissionGate>

      <View style={styles.tournaments}>
        <View style={styles.header}>
          <Text style={styles.title}>{isOrganizer ? 'Mis Marcas 2' : 'Mis Torneos'}</Text>
          <Text style={styles.subtitle}>
            {isOrganizer
              ? 'Gestiona tus marcas y ediciones'
              : 'Visualiza tus torneos y competiciones'}
          </Text>
        </View>

        {listItems.length > 0 ? (
          <OurTournamentsList
            tournaments={listItems}
            refreshing={isRefreshing}
            onRefresh={refresh}
            onPressItem={handlePressItem}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <CustomIcon name='empty-tournament' size={250} />
            <Text style={styles.emptyTitle}>
              {isOrganizer ? 'Aún no tienes marcas' : 'No tienes torneos registrados'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isOrganizer
                ? 'Crea tu primera marca de torneo para empezar a organizar ediciones y competiciones.'
                : 'Aún no estás participando en ningún torneo actualmente 2.'}
            </Text>
            <PermissionGate permission='brand:create'>
              <TouchableOpacity
                style={styles.createButton}
                activeOpacity={0.8}
                onPress={() => router.push('/winnix/brand/create')}
              >
                <Ionicons
                  name='trophy-outline'
                  size={20}
                  color={Colors.light}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.createButtonText}>CREAR MI PRIMERA MARCA</Text>
              </TouchableOpacity>
            </PermissionGate>
          </View>
        )}
      </View>
    </MainContainerView>
  );
};

export default OurTournaments;

const styles = StyleSheet.create({
  tournaments: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Fonts.small,
    color: Colors.gray,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    zIndex: 1,
    right: 20,
    backgroundColor: Colors.primary,
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderColor: Colors.light,
    borderWidth: 1,
    elevation: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Fonts.normal,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 8,
  },
  createButtonText: {
    color: Colors.light,
    fontSize: Fonts.normal,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
