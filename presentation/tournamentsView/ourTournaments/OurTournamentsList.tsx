import { useCallback, useRef } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Colors } from '@/presentation/styles/global-styles';
import { TournamentTeamItem } from '../TournamentTeamItem';

interface Props {
  tournaments: any;
  refreshing?: boolean;
  onRefresh?: () => void;
  onPressItem: (item: any) => void;
}

const OurTournamentsList = ({
  tournaments,
  refreshing = false,
  onRefresh,
  onPressItem,
}: Props) => {
  const isNavigating = useRef(false);

  const handlePress = useCallback(
    (item: any) => {
      if (isNavigating.current) return;

      isNavigating.current = true;
      onPressItem(item);

      // Safety release after 1 second to account for slow transitions
      setTimeout(() => {
        isNavigating.current = false;
      }, 1000);
    },
    [onPressItem],
  );

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
            stats={
              item.stats || [
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
              ]
            }
            styleText={item.styleText}
            onPressCard={() => handlePress(item)}
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
