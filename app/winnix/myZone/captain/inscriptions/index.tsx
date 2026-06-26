import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useMyInscriptions } from '@/presentation/hooks/inscriptions/useMyInscriptions';
import { Colors, Fonts } from '@/presentation/styles/global-styles';
import { MainContainerView } from '@/presentation/theme/components/MainContainerView';
import { CustomIcon } from '@/presentation/theme/components/icons/CustomIcon';
import OurTournamentsList from '@/presentation/tournamentsView/shared/OurTournamentsList';

/**
 * Vista exclusiva del Capitán: lista sus inscripciones a torneos.
 * Ruta: /winnix/myZone/captain/inscriptions
 */
const CaptainInscriptionsScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const { inscriptions, loading, isRefreshing, refresh } = useMyInscriptions();

  React.useEffect(() => {
    navigation.setOptions({ title: 'Mis Torneos' });
  }, [navigation]);

  const listItems = inscriptions.map((ins: any) => ({
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
    if (item.editionId) {
      router.push(`/winnix/ourTournaments/tournament/${item.editionId}`);
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mis Torneos</Text>
          <Text style={styles.subtitle}>
            Visualiza tus torneos y competiciones activas
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
            <Text style={styles.emptyTitle}>No tienes torneos registrados</Text>
            <Text style={styles.emptySubtitle}>
              Aún no estás participando en ningún torneo actualmente.
            </Text>
          </View>
        )}
      </View>
    </MainContainerView>
  );
};

export default CaptainInscriptionsScreen;

const styles = StyleSheet.create({
  container: {
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
});
