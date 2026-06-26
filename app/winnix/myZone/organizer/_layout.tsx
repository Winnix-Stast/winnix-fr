import { Redirect, Stack } from 'expo-router';
import { usePermission } from '@/presentation/hooks/auth/usePermission';

/**
 * Layout exclusivo del rol Organizador.
 * Guard: si el usuario no tiene el permiso 'create:tournament'
 * es redirigido al dashboard general.
 */
const OrganizerLayout = () => {
  const { can } = usePermission();

  if (!can('create:tournament')) {
    return <Redirect href='/winnix/tabs/dashboard' />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='brands/index' />
      <Stack.Screen name='brands/[brandId]/index' />
    </Stack>
  );
};

export default OrganizerLayout;
