import React from 'react';
import { TournamentStagesLayout } from '../stagesLayout/TournamentStagesLayout';

interface Props {
  editionId: string;
  isOrganizer: boolean;
}

export const TournamentOrganizerSection = ({ editionId, isOrganizer }: Props) => {
  return <TournamentStagesLayout editionId={editionId} isOrganizer={isOrganizer} />;
};
