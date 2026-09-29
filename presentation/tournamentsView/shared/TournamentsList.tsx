import { useMemo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { tournamentsActions } from '@/core/tournaments/actions/tournaments-actions';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { IconName } from '@/presentation/plugins/Icon';
import { getTournamentStatusConfig } from '@/presentation/styles';
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
  selectedStatus?: string;
  myInscriptions?: any[];
}

const TournamentsList = ({
  tournaments,
  isLoading,
  isRefreshing,
  onRefresh,
  onEndReached,
  hasNextPage,
  selectedStatus,
  myInscriptions,
}: Props) => {
  const { user } = useAuthStore();
  const userId = user?.id || (user as any)?._id;

  const { data: myManagedEditions = [] } = useQuery({
    queryKey: ['my-managed-editions'],
    queryFn: tournamentsActions.getMyEditionsAction,
    enabled: !!userId,
  });

  const handleNavigate = (item: any) => {
    router.push(`/winnix/tournament/${item._id}`);
  };

  const myInscribedEditionIds = useMemo(() => {
    return new Set(
      (myInscriptions || [])
        .map((ins: any) => {
          const ed = ins.tournamentEdition || ins.edition;
          return typeof ed === 'object' ? ed?._id : ed;
        })
        .filter(Boolean),
    );
  }, [myInscriptions]);

  const myManagedEditionIds = useMemo(() => {
    return new Set((myManagedEditions || []).map((ed: any) => ed._id).filter(Boolean));
  }, [myManagedEditions]);

  const sortedTournaments = useMemo(() => {
    let list = tournaments ? [...tournaments] : [];

    if (selectedStatus === 'MY_TOURNAMENTS') {
      const mapById = new Map<string, any>();

      list.forEach((item) => {
        if (item && item._id) mapById.set(item._id, item);
      });

      (myManagedEditions || []).forEach((item: any) => {
        if (item && item._id && !mapById.has(item._id)) {
          mapById.set(item._id, item);
        }
      });

      const combined = Array.from(mapById.values());

      list = combined.filter((edition) => {
        if (myInscribedEditionIds.has(edition._id)) return true;
        if (myManagedEditionIds.has(edition._id)) return true;

        if (userId) {
          const brand =
            typeof edition.tournament === 'object' ? edition.tournament : null;
          const organizerId = brand?.organizer
            ? typeof brand.organizer === 'object'
              ? brand.organizer._id || brand.organizer.id
              : brand.organizer
            : null;

          if (organizerId && String(organizerId) === String(userId)) return true;

          if (Array.isArray(edition.subOrganizers)) {
            const isSub = edition.subOrganizers.some((sub: any) => {
              const subId = typeof sub === 'object' ? sub._id || sub.id : sub;
              return String(subId) === String(userId);
            });
            if (isSub) return true;
          }
        }

        return false;
      });
    }

    return list.sort((a, b) => {
      const timeA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const timeB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return timeB - timeA;
    });
  }, [
    tournaments,
    myManagedEditions,
    selectedStatus,
    myInscribedEditionIds,
    myManagedEditionIds,
    userId,
  ]);

  const mapEditionToItem = (edition: any) => {
    const isInscribed =
      myInscribedEditionIds.has(edition._id) || myManagedEditionIds.has(edition._id);
    const statusConfig = getTournamentStatusConfig(edition.status || 'DRAFT');
    const isAct = ['REGISTRATION_OPEN', 'ACTIVE', 'IN_PROGRESS', 'PUBLISHED'].includes(
      (edition.status || '').toUpperCase(),
    );

    const imageSource =
      edition.image ||
      edition.logo ||
      (typeof edition.tournament === 'object' ? edition.tournament?.logo : null) ||
      require('../../../assets/icons/tournament.png');

    return {
      ...edition,
      isInscribed,
      label: edition.seasonName || 'Edición',
      state: edition.status || 'DRAFT',
      statusLabel: statusConfig.label,
      statusColor: statusConfig.color,
      isActive: isAct,
      img: imageSource,
      stats: [
        {
          _id: `${edition._id}-status`,
          iconName: 'flag-outline' as IconName,
          title: 'ESTADO',
          value: statusConfig.label.toUpperCase(),
          iconColor: statusConfig.color,
          flexText: true,
        },
        {
          _id: `${edition._id}-date`,
          iconName: 'calendar-outline' as IconName,
          title: 'INICIO',
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

  if (sortedTournaments.length === 0) {
    const emptyTitle =
      selectedStatus === 'MY_TOURNAMENTS'
        ? 'No tienes o participas en ningún torneo'
        : 'No hay torneos disponibles';
    const emptySub =
      selectedStatus === 'MY_TOURNAMENTS'
        ? 'Crea un torneo como organizador o inscribe a tu equipo para gestionarlo aquí'
        : 'Las ediciones creadas aparecerán aquí';

    return (
      <View style={{ paddingVertical: 60, alignItems: 'center', gap: 8 }}>
        <CustomText label={emptyTitle} color={Colors.gray} size={16} weight='bold' />
        <CustomText label={emptySub} color={Colors.gray} size={14} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={sortedTournaments.map(mapEditionToItem)}
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
            isActive={item.isActive}
            isInscribed={item.isInscribed}
            statusLabelText={item.statusLabel}
            statusColorCode={item.statusColor}
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
