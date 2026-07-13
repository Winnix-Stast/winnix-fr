import React from 'react';
import { Redirect } from 'expo-router';
import { usePermission } from '@/presentation/hooks/auth/usePermission';

export default function MyZoneIndex() {
  const { can } = usePermission();
  const isOrganizer = can('create:tournament');

  if (isOrganizer) {
    return <Redirect href='/winnix/myZone/organizer/brands' />;
  } else {
    return <Redirect href='/winnix/myZone/captain/inscriptions' />;
  }
}
