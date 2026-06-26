import React from 'react';
import { ScrollView } from 'react-native';
import { FeaturedNews } from '@/presentation/dashboard/FeaturedNews';
import { NextEvents } from '@/presentation/dashboard/NextEvents/NextEvents';
import { Sponsors } from '@/presentation/dashboard/sponsor/Sponsor';

export const PlayerDashboardView = () => {
  return (
    <ScrollView>
      <FeaturedNews />
      <NextEvents />
      <Sponsors />
    </ScrollView>
  );
};
