import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTournament } from '@/presentation/hooks/tournamentStack/tournament/useTournament';
import { useTournamentsInfinite } from '@/presentation/hooks/tournaments/useTournamentsInfinite';
import { Colors, Fonts } from '@/presentation/styles/global-styles';
import { CustomSearch } from '@/presentation/theme/components/CustomSearch';
import { MainContainerView } from '@/presentation/theme/components/MainContainerView';
import TeamsList from '@/presentation/tournamentsView/TeamsList';
import TournamentsList from '@/presentation/tournamentsView/TournamentsList';

const OurTournaments = () => {
  const [viewSelected, setViewSelected] = useState('viewTournaments');

  const { control, watch } = useTournament(viewSelected);

  // 1. Debounce del search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchValue = watch ? watch('search') : '';

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue || '');
    }, 400);
    return () => clearTimeout(handler);
  }, [searchValue]);

  // 2. Filtro de estado
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // 3. Hook de infinite query para torneos
  const { tournaments, loading, refresh, fetchNextPage, hasNextPage, isRefreshing } =
    useTournamentsInfinite({
      search: debouncedSearch,
      status: selectedStatus,
    });

  const statusChips = [
    { key: 'ALL', label: 'Todos' },
    { key: 'DRAFT', label: 'Próximamente' },
    { key: 'REGISTRATION_OPEN', label: 'Inscripción' },
    { key: 'ACTIVE', label: 'En curso' },
    { key: 'FINISHED', label: 'Finalizado' },
  ];

  console.log('tournaments ss:>> ', tournaments);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <MainContainerView>
          <View style={styles.tournaments}>
            <CustomSearch
              name='search'
              control={control}
              placeholder='Escribe aquí...'
              iconLeft='search'
            />

            {viewSelected === 'viewTournaments' && (
              <View style={{ height: 50, marginBottom: 10 }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsContainer}
                >
                  {statusChips.map((chip) => {
                    const isActive = selectedStatus === chip.key;
                    return (
                      <Pressable
                        key={chip.key}
                        onPress={() => setSelectedStatus(chip.key)}
                        style={[
                          styles.chip,
                          isActive ? styles.chipActive : styles.chipInactive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            { color: isActive ? Colors.light : '#7e8bba' },
                          ]}
                        >
                          {chip.label.toUpperCase()}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            <View style={styles.tournamentsTagsContainer}>
              <Pressable
                onPress={() => setViewSelected('viewTournaments')}
                style={[
                  styles.tournamentsTags,
                  viewSelected === 'viewTournaments'
                    ? styles.tagActive
                    : styles.tagInactive,
                ]}
              >
                <Ionicons
                  name='trophy-outline'
                  size={20}
                  color={
                    viewSelected === 'viewTournaments' ? Colors.primary : Colors.gray
                  }
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.tournamentsTagsText,
                    {
                      color:
                        viewSelected === 'viewTournaments' ? Colors.light : Colors.gray,
                    },
                  ]}
                >
                  TORNEOS
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setViewSelected('viewTeams')}
                style={[
                  styles.tournamentsTags,
                  viewSelected === 'viewTeams' ? styles.tagActive : styles.tagInactive,
                ]}
              >
                <Ionicons
                  name='people-outline'
                  size={20}
                  color={viewSelected === 'viewTeams' ? Colors.primary : Colors.gray}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.tournamentsTagsText,
                    {
                      color: viewSelected === 'viewTeams' ? Colors.light : Colors.gray,
                    },
                  ]}
                >
                  EQUIPOS
                </Text>
              </Pressable>
            </View>

            <View style={{ flex: 1 }}>
              {viewSelected === 'viewTournaments' ? (
                <TournamentsList
                  tournaments={tournaments}
                  isLoading={loading}
                  isRefreshing={isRefreshing}
                  onRefresh={refresh}
                  onEndReached={fetchNextPage}
                  hasNextPage={hasNextPage}
                />
              ) : (
                <TeamsList />
              )}
            </View>
          </View>
        </MainContainerView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OurTournaments;

const styles = StyleSheet.create({
  tournaments: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  tournamentsTitle: {
    color: Colors.light,
    fontSize: Fonts.large,
  },
  tournamentsTagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    borderRadius: 14,
    backgroundColor: '#070a1e',
    borderWidth: 1.5,
    borderColor: '#192147',
    marginVertical: 16,
  },
  tournamentsTags: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '48.5%',
    paddingVertical: 12,
    height: 48,
    borderRadius: 10,
  },
  tagActive: {
    backgroundColor: 'rgba(0, 200, 151, 0.15)',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  tagInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tournamentsTagsText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 38,
    transform: [{ skewX: '-12deg' }],
  },
  chipActive: {
    backgroundColor: 'rgba(0, 200, 151, 0.18)',
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 5,
  },
  chipInactive: {
    backgroundColor: '#070a1e',
    borderColor: '#1e295d',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    transform: [{ skewX: '12deg' }],
  },
});
