import { View } from 'react-native';
import { InfoContactCard } from './InfoContactCard';
import { InfoLocationCard } from './InfoLocationCard';
import { TournamentOrganizerCard } from './InfoOrganizerCard';
import { InfoRules } from './InfoRules';
import { InfoTimeLine } from './InfoTimeLine';

interface Props {
  edition: any;
  isOrganizer: boolean;
}

export const InformationTournament = ({ edition, isOrganizer }: Props) => {
  const tournament = edition?.tournament;
  const organizer = tournament?.organizer;
  const sportTemplate = edition?.sportTemplate;

  return (
    <View style={{ width: '100%', gap: 24, marginTop: 18 }}>
      {/* Organizer Card */}
      <TournamentOrganizerCard
        organizerName={tournament?.name || 'Sin nombre'}
        organizerBy={organizer?.username || 'Organizador'}
        description={tournament?.description || ''}
        logo={tournament?.logo}
        stats={{
          tournaments: tournament?.globalStats?.totalEditions ?? 0,
          players: edition?.editionStats?.matchesPlayed ?? 0,
          prizes: '—',
        }}
      />

      {/* Field / Location Card */}
      <InfoLocationCard fieldAddress={edition?.fieldAddress} />

      {/* Rules */}
      <InfoRules edition={edition} sportTemplate={sportTemplate} />

      {/* Timeline from stages */}
      <InfoTimeLine editionId={edition?._id} />

      {/* Contact & Support */}
      <InfoContactCard
        organizer={organizer}
        subOrganizers={edition?.subOrganizers || []}
      />
    </View>
  );
};
