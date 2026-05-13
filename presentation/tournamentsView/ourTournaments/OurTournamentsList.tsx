import { useCallback, useRef } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/presentation/styles/global-styles';
import { TournamentTeamItem } from '../TournamentTeamItem';

interface Props {
  tournaments: any;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const OurTournamentsList = ({ tournaments, refreshing = false, onRefresh }: Props) => {
  const isNavigating = useRef(false);

  const handleNavigate = useCallback((item: any) => {
    if (isNavigating.current) return;

    isNavigating.current = true;

    // Using navigate for idempotency
    router.navigate(`/winnix/ourTournaments/${item._id}`);

    // Safety release after 1 second to account for slow transitions
    setTimeout(() => {
      isNavigating.current = false;
    }, 1000);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tournaments}
        keyExtractor={(item) => item._id}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          ) : undefined
        }
        renderItem={({ item }) => (
          <TournamentTeamItem
            id={item._id}
            label={item.name}
            isActive={item.isActive}
            isFavorite={false}
            img={item.logo || require('../../../assets/icons/brand/default/escudo2.png')}
            stats={[
              {
                _id: `${item._id}-editions`,
                iconName: 'layers-outline',
                title: 'Ediciones',
                value: `${item.globalStats?.totalEditions || 0}`,
                iconColor: Colors.primary,
              },
              {
                _id: `${item._id}-matches`,
                iconName: 'football-outline',
                title: 'Partidos',
                value: `${item.globalStats?.totalMatchesPlayed || 0}`,
                iconColor: '#22C55E',
              },
              {
                _id: `${item._id}-rating`,
                iconName: 'star-outline',
                title: 'Rating',
                value: `${item.averageRating || 0}`,
                iconColor: '#FBBF24',
              },
            ]}
            onPressCard={() => handleNavigate(item)}
          />
        )}
        contentContainerStyle={{
          gap: 15,
          paddingBottom: 70,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default OurTournamentsList;
