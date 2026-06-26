import React from 'react';
import { RosterLayout } from '../rosterLayout/RosterLayout';

interface Props {
  members: any;
  loadingMembers: boolean;
  selectedPlayers: string[];
  jerseyNumbers: Record<string, string>;
  isSavingRoster: boolean;
  playersPerTeam?: number;
  handleTogglePlayer: (membershipId: string) => void;
  handleJerseyNumberChange: (membershipId: string, val: string) => void;
  handleSaveRoster: () => Promise<void>;
}

export const TournamentCaptainSection = ({
  members,
  loadingMembers,
  selectedPlayers,
  jerseyNumbers,
  isSavingRoster,
  playersPerTeam,
  handleTogglePlayer,
  handleJerseyNumberChange,
  handleSaveRoster,
}: Props) => {
  return (
    <RosterLayout
      members={members}
      loadingMembers={loadingMembers}
      selectedPlayers={selectedPlayers}
      jerseyNumbers={jerseyNumbers}
      isSavingRoster={isSavingRoster}
      playersPerTeam={playersPerTeam ?? 0}
      handleTogglePlayer={handleTogglePlayer}
      handleJerseyNumberChange={handleJerseyNumberChange}
      handleSaveRoster={handleSaveRoster}
    />
  );
};
