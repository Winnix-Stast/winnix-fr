import { Redirect, Stack } from 'expo-router';
import { usePermission } from '@/presentation/hooks/auth/usePermission';

/**
 * Layout exclusivo del rol Capitán.
 * Guard: si el usuario no tiene el permiso 'create:team'
 * es redirigido al dashboard general.
 */
const CaptainLayout = () => {
  const { can } = usePermission();

  if (!can('create:team')) {
    return <Redirect href='/winnix/tabs/dashboard' />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='inscriptions/index' />
    </Stack>
  );
};

export default CaptainLayout;
