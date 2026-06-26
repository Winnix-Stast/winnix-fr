import React from 'react';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { CaptainDashboardView } from '@/presentation/dashboard/captain/CaptainDashboardView';
import { OrganizerDashboardView } from '@/presentation/dashboard/organizer/OrganizerDashboardView';
import { PlayerDashboardView } from '@/presentation/dashboard/player/PlayerDashboardView';
import { MainContainerView } from '@/presentation/theme/components/MainContainerView';

const Dashboard = () => {
  const { activeRole } = useAuthStore();

  const renderDashboard = () => {
    if (activeRole === 'organizer' || activeRole === 'tournament manager')
      return <OrganizerDashboardView />;
    if (activeRole === 'captain') return <CaptainDashboardView />;
    return <PlayerDashboardView />;
  };

  return <MainContainerView>{renderDashboard()}</MainContainerView>;
};

export default Dashboard;
