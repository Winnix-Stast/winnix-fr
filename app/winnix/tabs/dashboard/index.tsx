import { CaptainDashboardView } from "@/presentation/dashboard/CaptainDashboardView";
import { OrganizerDashboardView } from "@/presentation/dashboard/OrganizerDashboardView";
import { PlayerDashboardView } from "@/presentation/dashboard/PlayerDashboardView";
import { MainContainerView } from "@/presentation/theme/components/MainContainerView";
import React from "react";

import { useAuthStore } from "@/presentation/auth/store/useAuthStore";

const Dashboard = () => {
  const { activeRole } = useAuthStore();

  const renderDashboard = () => {
    if (activeRole === "organizer" || activeRole === "tournament manager") return <OrganizerDashboardView />;
    if (activeRole === "captain") return <CaptainDashboardView />;
    return <PlayerDashboardView />;
  };

  return <MainContainerView>{renderDashboard()}</MainContainerView>;
};

export default Dashboard;
