import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors, getTournamentStatusConfig } from '@/presentation/styles';

interface OrganizerTournamentsSectionProps {
  myEditions: any[];
  hasBrands: boolean;
  onCreateTournament: () => void;
}

export const OrganizerTournamentsSection = ({
  myEditions,
  hasBrands,
  onCreateTournament,
}: OrganizerTournamentsSectionProps) => {
  const router = useRouter();

  const handleSeeAll = () => {
    router.push('/winnix/tabs/(tournamentStack)');
  };

  const handlePressTournament = (editionId: string) => {
    router.push(`/winnix/tournament/${editionId}`);
  };

  const formatEdition = (edition: any) => {
    const statusConfig = getTournamentStatusConfig(edition.status || 'DRAFT');
    const sportName = edition.sport?.name || edition.sportTemplate?.name || 'Deporte';
    const startDateStr = edition.startDate
      ? new Date(edition.startDate).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : 'Sin fecha';

    return {
      statusConfig,
      sportName,
      startDateStr,
      seasonName: edition.seasonName || 'Edición Sin Nombre',
    };
  };

  const hasEditions = myEditions.length > 0;

  return (
    <>
      {/* SECCIÓN PRINCIPAL: MIS TORNEOS */}
      <View style={[styles.sectionHeader, { marginTop: 28, marginBottom: 12 }]}>
        <View style={styles.sectionTitleWithBadge}>
          <Text style={styles.sectionTitle}>Mis Torneos</Text>
          {hasEditions && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{myEditions.length}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      {!hasEditions ? (
        <View style={styles.emptyTournamentsCard}>
          <View style={styles.emptyIconCircle}>
            <WinnixIcon name='trophy-outline' size={28} color={Colors.brand_primary} />
          </View>
          <Text style={styles.emptyTournamentsTitle}>Aún no tienes torneos creados</Text>
          <Text style={styles.emptyTournamentsSub}>
            Crea las ediciones o campeonatos de tu marca para gestionarlos desde aquí.
          </Text>
          {hasBrands && (
            <TouchableOpacity
              style={styles.createTournamentBtn}
              onPress={onCreateTournament}
              activeOpacity={0.8}
            >
              <Text style={styles.createTournamentBtnText}>CREAR UN TORNEO</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.tournamentsListWrapper}>
          {myEditions.map((edition: any) => {
            const { statusConfig, sportName, startDateStr, seasonName } =
              formatEdition(edition);

            return (
              <TouchableOpacity
                key={edition._id}
                style={styles.tournamentCard}
                activeOpacity={0.85}
                onPress={() => handlePressTournament(edition._id)}
              >
                <View style={styles.tournamentCardHeader}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: statusConfig.color + '1A',
                        borderColor: statusConfig.color + '40',
                      },
                    ]}
                  >
                    <View
                      style={[styles.statusDot, { backgroundColor: statusConfig.color }]}
                    />
                    <Text style={[styles.statusText, { color: statusConfig.color }]}>
                      {statusConfig.label.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.sportBadge}>{sportName}</Text>
                </View>

                <Text style={styles.tournamentName} numberOfLines={1}>
                  {seasonName}
                </Text>

                <View style={styles.tournamentFooter}>
                  <View style={styles.dateRow}>
                    <WinnixIcon
                      name='calendar-outline'
                      size={16}
                      color={Colors.text_tertiary}
                    />
                    <Text style={styles.dateText}>{startDateStr}</Text>
                  </View>

                  <View style={styles.arrowRow}>
                    <Text style={styles.manageText}>Gestionar</Text>
                    <WinnixIcon
                      name='chevron-forward-outline'
                      size={18}
                      color={Colors.brand_primary}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  countBadge: {
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.3)',
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.brand_primary,
  },
  seeAllText: {
    fontSize: 16,
    color: Colors.brand_primary,
    fontWeight: '600',
  },
  emptyTournamentsCard: {
    marginHorizontal: 20,
    padding: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    gap: 8,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyTournamentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  emptyTournamentsSub: {
    fontSize: 15,
    color: Colors.text_tertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  createTournamentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.actions_primary_bg,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  createTournamentBtnText: {
    color: Colors.on_brand,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  tournamentsListWrapper: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tournamentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  tournamentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  sportBadge: {
    fontSize: 14,
    color: Colors.text_secondary,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tournamentName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.text_primary,
    marginBottom: 12,
  },
  tournamentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: Colors.text_tertiary,
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  manageText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.brand_primary,
  },
});
