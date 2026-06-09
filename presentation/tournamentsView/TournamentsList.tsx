import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { router } from 'expo-router';
import { IconName } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/global-styles';
import { CustomText } from '@/presentation/theme/components/CustomText';
import { TournamentTeamItem } from './TournamentTeamItem';

interface Props {
  tournaments: any[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  hasNextPage: boolean;
}

const TournamentsList = ({
  tournaments,
  isLoading,
  isRefreshing,
  onRefresh,
  onEndReached,
  hasNextPage,
}: Props) => {
  const handleNavigate = (item: any) => {
    router.push(`/winnix/tabs/(tournamentStack)/tournament/${item._id}`);
  };

  const statusMap: Record<string, string> = {
    draft: 'Próximamente',
    published: 'Publicado',
    in_progress: 'En curso',
    finished: 'Finalizado',
    cancelled: 'Cancelado',
  };

  const mapEditionToItem = (edition: any) => {
    const statusKey = (edition.status || 'draft').toLowerCase();
    const statusText = statusMap[statusKey] || edition.status;

    return {
      ...edition,
      label: edition.seasonName || 'Edición',
      state: edition.status || 'draft',
      img: edition.image || require('../../assets/icons/tournament.png'),
      stats: [
        {
          _id: `${edition._id}-status`,
          iconName: 'flag-outline' as IconName,
          title: 'Estado',
          value: statusText,
          iconColor: Colors.primary,
        },
        {
          _id: `${edition._id}-date`,
          iconName: 'calendar-outline' as IconName,
          title: 'Inicio',
          value: edition.startDate
            ? new Date(edition.startDate).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
              })
            : 'Sin definir',
          iconColor: Colors.secondaryDark,
        },
      ],
    };
  };

  if (isLoading && tournaments.length === 0) {
    return (
      <View style={{ paddingVertical: 40, alignItems: 'center' }}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }

  if (tournaments.length === 0) {
    return (
      <View style={{ paddingVertical: 60, alignItems: 'center', gap: 8 }}>
        <CustomText
          label='No hay torneos disponibles'
          color={Colors.gray}
          size={16}
          weight='bold'
        />
        <CustomText
          label='Las ediciones creadas aparecerán aquí'
          color={Colors.gray}
          size={14}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tournaments.map(mapEditionToItem)}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing && tournaments.length > 0}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        renderItem={({ item }) => (
          <TournamentTeamItem
            id={item._id}
            label={item.label}
            isActive={item.state === 'published' || item.state === 'in_progress'}
            img={item.img}
            stats={item.stats}
            onPressCard={() => handleNavigate(item)}
          />
        )}
        onEndReached={hasNextPage ? onEndReached : null}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isRefreshing && hasNextPage ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator size='small' color={Colors.primary} />
            </View>
          ) : null
        }
        contentContainerStyle={{
          gap: 20,
          paddingBottom: 150,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TournamentsList;
