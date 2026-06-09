import React from 'react';
import { IconName } from '@/presentation/plugins/Icon';
import { ParticipationCard } from './ParticipationCard';
import { Activity, RecentActivityCard } from './RecentActivityCard';
import { TournamentStatsCard } from './TournamentStatsCard';

interface Stat {
  label: string;
}
interface Props {
  stats: Stat[];
  activities: Activity[];
  showParticipation?: boolean;
  onInscribe?: () => void;
  participationProps?: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    iconName?: IconName;
    headerIconName?: IconName;
    headerText?: string;
    gradientColors?: [string, string];
    accentColor?: string;
  };
}

export const ResumeLayout = ({
  stats,
  activities,
  showParticipation = false,
  onInscribe,
  participationProps,
}: Props) => {
  return (
    <>
      {/* Join to tournament (Only visible to Captains or Players who are not the organizer) */}
      {showParticipation && onInscribe && (
        <ParticipationCard onPressButton={onInscribe} {...participationProps} />
      )}

      {/* Statistics */}
      <TournamentStatsCard stats={stats} />

      {/* Recently Activity */}
      <RecentActivityCard activities={activities} />
    </>
  );
};
