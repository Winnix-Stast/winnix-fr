import { Stack } from 'expo-router';

/**
 * myZone — Zona personal del usuario autenticado.
 * Cada subruta tiene su propio layout con guard de permiso:
 *   - organizer/  → requiere permiso 'create:tournament'
 *   - captain/    → requiere permiso 'create:team'
 */
const MyZoneLayout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name='organizer' />
    <Stack.Screen name='captain' />
  </Stack>
);

export default MyZoneLayout;
