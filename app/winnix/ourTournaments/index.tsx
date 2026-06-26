import { Redirect } from 'expo-router';
import { usePermission } from '@/presentation/hooks/auth/usePermission';

const OurTournamentsRedirect = () => {
  const { can } = usePermission();
  const isOrganizer = can('create:tournament');

  if (isOrganizer) {
    return <Redirect href='/winnix/myZone/organizer/brands' />;
  }

  return <Redirect href='/winnix/myZone/captain/inscriptions' />;
};

export default OurTournamentsRedirect;
