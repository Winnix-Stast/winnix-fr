import React from 'react';
import { ParticipationCard } from './ParticipationCard';
import { Activity, RecentActivityCard } from './RecentActivityCard';
import { TournamentStatsCard } from './TournamentStatsCard';

interface Stat {
  label: string;
  value: string | number;
}

interface Props {
  stats: Stat[];
  activities: Activity[];
  showParticipation?: boolean;
  onInscribe?: () => void;
}

export const ResumeLayout = ({
  stats,
  activities,
  showParticipation = false,
  onInscribe,
}: Props) => {
  return (
    <>
      {/* Join to tournament (Only visible to Captains or Players who are not the organizer) */}
      {showParticipation && onInscribe && (
        <ParticipationCard onPressButton={onInscribe} />
      )}

      {/* Statistics */}
      <TournamentStatsCard stats={stats} />

      {/* Recently Activity */}
      <RecentActivityCard activities={activities} />
    </>
  );
};
