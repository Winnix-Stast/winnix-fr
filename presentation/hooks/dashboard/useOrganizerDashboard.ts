import { useRouter } from 'expo-router';
import { tournamentsActions } from '@/core/tournaments/actions/tournaments-actions';
import { useQueryAdapter } from '@/helpers/adapters/queryAdapter';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useMyTournaments } from '@/presentation/hooks/tournaments/useMyTournaments';

export const useOrganizerDashboard = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { tournaments: brands, loading: loadingBrands } = useMyTournaments();

  const { data: myEditionsData, isLoading: loadingEditions } = useQueryAdapter(
    ['my-editions'],
    () => tournamentsActions.getMyEditionsAction(),
  );

  const myEditions = Array.isArray(myEditionsData) ? myEditionsData : [];
  const userName = user?.username || '';

  const handleCreateBrand = () => {
    router.push('/winnix/brand/create');
  };

  const handleCreateTournament = () => {
    if (brands.length > 0) {
      router.push({
        pathname: '/winnix/tournament/create',
        params: { brandId: brands[0]?._id },
      });
    } else {
      router.push('/winnix/tournament/create');
    }
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

  return {
    userName,
    brands,
    myEditions,
    isLoading: loadingBrands || loadingEditions,
    totalBrands,
    totalTournaments,
    totalMatches,
    totalGoals,
    handleCreateBrand,
    handleCreateTournament,
    handlePressBrand,
    handleNavigateToBrandsTab,
    handleNavigateToCalendar,
    router,
  };
};
