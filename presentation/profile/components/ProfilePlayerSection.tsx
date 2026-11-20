import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { User } from '@/core/auth/interface/user';
import { UserProfile } from '@/core/profile/interface/profile.interface';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';

interface Props {
  user?: User | UserProfile | null;
  inscriptions: any[];
  loadingInscriptions: boolean;
  isOwnProfile?: boolean;
}

export const ProfilePlayerSection: React.FC<Props> = ({
  user,
  inscriptions,
  isOwnProfile = true,
}) => {
  const { activeRole } = useAuthStore();
  const isCaptain = activeRole === 'captain';

  const email = user?.email || 'No especificado';
  const rawPhone = user?.phoneNumber || (user as any)?.contact?.phone;
  const phone = rawPhone ? `${rawPhone}` : 'No registrado';

  const calculateAge = (dateVal?: string | Date | null) => {
    if (!dateVal) return null;
    const birth = new Date(dateVal);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? age : null;
  };

  const userAge = calculateAge(user?.birthDate);
  const formattedBirthDate = user?.birthDate
    ? new Date(user.birthDate).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const position = (user as any)?.preferredPosition || (user as any)?.position;
  const dorsal = (user as any)?.dorsalNumber || (user as any)?.dorsal;
  const preferredFoot = (user as any)?.preferredFoot || (user as any)?.foot;
  const honorsList = (user as any)?.honors || (user as any)?.palmares || [];

  const hasPlayerTraits = Boolean(position || dorsal || preferredFoot);

  return (
    <View style={styles.container}>
      {/* ======================= * QUICK PLAYER TRAITS GRID (Only if real traits exist) * ======================= */}
      {hasPlayerTraits && (
        <View style={styles.traitsGrid}>
          {position && (
            <View style={styles.traitCard}>
              <Text style={styles.traitLabel}>POSICIÓN</Text>
              <Text style={styles.traitValue}>{String(position).toUpperCase()}</Text>
              <Text style={styles.traitSub}>En la cancha</Text>
            </View>
          )}

          {dorsal && (
            <View style={styles.traitCard}>
              <Text style={styles.traitLabel}>DORSAL</Text>
              <Text style={[styles.traitValue, { color: Colors.brand_primary }]}>#{dorsal}</Text>
              <Text style={styles.traitSub}>Número</Text>
            </View>
          )}

          {preferredFoot && (
            <View style={styles.traitCard}>
              <Text style={styles.traitLabel}>PIE HÁBIL</Text>
              <Text style={[styles.traitValue, { color: Colors.orange_400 }]}>
                {String(preferredFoot).toUpperCase()}
              </Text>
              <Text style={styles.traitSub}>Perfil</Text>
            </View>
          )}
        </View>
      )}

      {/* ======================= * SEASON STATS SECTION * ======================= */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.titleWithIcon}>
          <WinnixIcon name='stats-chart-outline' size={18} color={Colors.text_brand} />
          <Text style={styles.sectionTitle}>ESTADÍSTICAS EN LA CANCHA</Text>
        </View>
        <View style={styles.totalGamesBadge}>
          <Text style={styles.totalGamesText}>
            {inscriptions.length > 0 ? `${inscriptions.length} TORNEOS` : 'SIN TORNEOS'}
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {/* Card 1: Tournaments Inscribed */}
        <View style={styles.statCard}>
          <View style={styles.statCardHeader}>
            <Text style={styles.statCardTitle}>TORNEOS JUGADOS</Text>
            <WinnixIcon name='trophy-outline' size={16} color={Colors.brand_primary} />
          </View>
          <View style={styles.statNumberRow}>
            <Text style={styles.statBigNumber}>{inscriptions.length}</Text>
          </View>
          <Text style={styles.statFooterText}>En la plataforma</Text>
        </View>

        {/* Card 2: Fair Play Discipline */}
        <View style={[styles.statCard, styles.highlightBorderCard]}>
          <View style={styles.statCardHeader}>
            <Text style={styles.statCardTitle}>JUEGO LIMPIO</Text>
            <View style={styles.topBadge}>
              <Text style={styles.topBadgeText}>FAIR PLAY</Text>
            </View>
          </View>
          <Text style={[styles.statBigNumber, { color: Colors.orange_400 }]}>A+</Text>
          <Text style={[styles.statFooterText, { color: Colors.brand_primary }]}>
            Sin sanciones activas
          </Text>
        </View>

        {/* Card 3: Active Competitions */}
        <View style={styles.statCard}>
          <View style={styles.statCardHeader}>
            <Text style={styles.statCardTitle}>EDICIONES ACTIVAS</Text>
            <WinnixIcon name='football-outline' size={16} color={Colors.brand_primary} />
          </View>
          <Text style={styles.statBigNumber}>
            {inscriptions.filter((i: any) => i.status === 'ACTIVE' || i.status === 'APPROVED').length}
          </Text>
          <Text style={styles.statFooterText}>Rodando el balón</Text>
        </View>

        {/* Card 4: Status / Role */}
        <View style={styles.statCard}>
          <View style={styles.statCardHeader}>
            <Text style={styles.statCardTitle}>
              {isCaptain ? 'ROL ACTIVO' : 'FICHAJE'}
            </Text>
            <WinnixIcon
              name={isCaptain ? 'shield-checkmark-outline' : 'checkmark-circle-outline'}
              size={16}
              color={isCaptain ? Colors.brand_primary : Colors.green_400}
            />
          </View>
          <Text
            style={[
              styles.statBigNumber,
              {
                fontSize: 15,
                color: isCaptain ? Colors.brand_primary : Colors.green_400,
              },
            ]}
          >
            {isCaptain ? 'CAPITÁN' : 'DISPONIBLE'}
          </Text>
          <Text style={styles.statFooterText}>
            {isCaptain ? 'Líder de escuadra' : 'Listo para la cancha'}
          </Text>
        </View>
      </View>

      {/* ======================= * INFORMACIÓN PERSONAL & CONTACTO (Con gobernanza de privacidad) * ======================= */}
      {isOwnProfile ? (
        <>
          <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
            <View style={styles.titleWithIcon}>
              <WinnixIcon name='person-outline' size={18} color={Colors.brand_primary} />
              <Text style={styles.sectionTitle}>INFORMACIÓN PERSONAL & CONTACTO</Text>
            </View>
            <View
              style={[
                styles.privacyBadge,
                user?.isContactInfoPublic ? styles.publicBadge : styles.privateBadge,
              ]}
            >
              <WinnixIcon
                name={user?.isContactInfoPublic ? 'globe-outline' : 'lock-closed-outline'}
                size={11}
                color={user?.isContactInfoPublic ? Colors.brand_primary : Colors.text_tertiary}
              />
              <Text
                style={[
                  styles.privacyBadgeText,
                  { color: user?.isContactInfoPublic ? Colors.brand_primary : Colors.text_tertiary },
                ]}
              >
                {user?.isContactInfoPublic ? 'PÚBLICO' : 'PRIVADO'}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>CORREO ELECTRÓNICO</Text>
                <Text style={styles.infoValue}>{email}</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeText}>Verificado</Text>
              </View>
            </View>

            {formattedBirthDate && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>FECHA DE NACIMIENTO</Text>
                    <Text style={styles.infoValue}>
                      {formattedBirthDate} {userAge !== null ? `(${userAge} años)` : ''}
                    </Text>
                  </View>
                  <WinnixIcon name='calendar-outline' size={18} color={Colors.brand_primary} />
                </View>
              </>
            )}

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>TELÉFONO DE CONTACTO</Text>
                <Text style={styles.infoValue}>{phone}</Text>
              </View>
              <WinnixIcon name='call-outline' size={18} color={Colors.text_tertiary} />
            </View>
          </View>
        </>
      ) : user?.isContactInfoPublic ? (
        <>
          <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
            <View style={styles.titleWithIcon}>
              <WinnixIcon name='person-outline' size={18} color={Colors.brand_primary} />
              <Text style={styles.sectionTitle}>INFORMACIÓN PERSONAL & CONTACTO</Text>
            </View>
            <View style={[styles.privacyBadge, styles.publicBadge]}>
              <WinnixIcon name='globe-outline' size={11} color={Colors.brand_primary} />
              <Text style={[styles.privacyBadgeText, { color: Colors.brand_primary }]}>PÚBLICO</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>CORREO ELECTRÓNICO</Text>
                <Text style={styles.infoValue}>{email}</Text>
              </View>
              <WinnixIcon name='mail-outline' size={18} color={Colors.brand_primary} />
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>TELÉFONO DE CONTACTO</Text>
                <Text style={styles.infoValue}>{phone}</Text>
              </View>
              <WinnixIcon name='call-outline' size={18} color={Colors.text_tertiary} />
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
            <View style={styles.titleWithIcon}>
              <WinnixIcon name='person-outline' size={18} color={Colors.text_tertiary} />
              <Text style={[styles.sectionTitle, { color: Colors.text_tertiary }]}>
                INFORMACIÓN DE CONTACTO
              </Text>
            </View>
            <View style={[styles.privacyBadge, styles.privateBadge]}>
              <WinnixIcon name='lock-closed-outline' size={11} color={Colors.text_tertiary} />
              <Text style={[styles.privacyBadgeText, { color: Colors.text_tertiary }]}>PRIVADO</Text>
            </View>
          </View>
          <View style={styles.privateNoticeCard}>
            <WinnixIcon name='shield-checkmark-outline' size={22} color={Colors.text_tertiary} />
            <Text style={styles.privateNoticeText}>
              Este usuario mantiene sus datos de contacto en modo privado conforme a las políticas de privacidad.
            </Text>
          </View>
        </>
      )}

      {/* ======================= * VITRINA DE TROFEOS & LOGROS * ======================= */}
      <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
        <WinnixIcon name='star' size={18} color={Colors.orange_400} />
        <Text style={styles.sectionTitle}>VITRINA DE TROFEOS & LOGROS</Text>
      </View>

      {honorsList.length > 0 ? (
        <View style={styles.honorsList}>
          {honorsList.map((honor: any, index: number) => (
            <View key={honor.id || index} style={styles.honorCard}>
              <View style={[styles.honorIconBg, { backgroundColor: Colors.orange_900 + '60' }]}>
                <WinnixIcon name='trophy' size={20} color={Colors.orange_400} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.honorTitle}>{honor.title || 'Campeón de Barrio'}</Text>
                <Text style={styles.honorSub}>{honor.tournament || 'Torneo Oficial Winnix'}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyHonorsCard}>
          <WinnixIcon name='trophy-outline' size={32} color={Colors.text_tertiary} />
          <Text style={styles.emptyHonorsTitle}>Sin Trofeos en la Vitrina</Text>
          <Text style={styles.emptyHonorsSub}>
            Las copas, medallas de campeón y premios por salir a romperla en la cancha se guardan aquí.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  traitsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  traitCard: {
    flex: 1,
    backgroundColor: Colors.surface_elevated,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  traitLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.text_tertiary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  traitValue: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text_primary,
  },
  traitSub: {
    fontSize: 10,
    color: Colors.brand_primary,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.text_brand,
    letterSpacing: 1.2,
  },
  totalGamesBadge: {
    backgroundColor: Colors.surface_elevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  totalGamesText: {
    color: Colors.brand_primary,
    fontSize: 10,
    fontWeight: '900',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '48.5%',
    backgroundColor: Colors.surface_elevated,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  highlightBorderCard: {
    borderColor: Colors.brand_primary + '60',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCardTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.text_tertiary,
    letterSpacing: 0.8,
  },
  statNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statBigNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.text_primary,
  },
  statTotalDenom: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text_tertiary,
  },
  statUnitText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text_tertiary,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.surface_pressed,
    borderRadius: 2,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.brand_primary,
  },
  statFooterText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text_secondary,
    marginTop: 2,
  },
  topBadge: {
    backgroundColor: Colors.orange_900 + '60',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  topBadgeText: {
    color: Colors.orange_400,
    fontSize: 9,
    fontWeight: '900',
  },
  infoCard: {
    backgroundColor: Colors.surface_elevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.text_tertiary,
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text_primary,
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surface_pressed,
    marginVertical: 10,
  },
  verifiedBadge: {
    backgroundColor: Colors.green_900 + '40',
    borderColor: Colors.green_500,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  verifiedBadgeText: {
    color: Colors.green_400,
    fontSize: 10,
    fontWeight: '800',
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  publicBadge: {
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    borderColor: 'rgba(40, 209, 195, 0.35)',
  },
  privateBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  privacyBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  privateNoticeCard: {
    backgroundColor: 'rgba(14, 21, 41, 0.6)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  privateNoticeText: {
    color: Colors.text_tertiary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  fairPlayBadge: {
    backgroundColor: Colors.brand_primary + '20',
    borderColor: Colors.brand_primary,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  fairPlayBadgeText: {
    color: Colors.brand_primary,
    fontSize: 10,
    fontWeight: '800',
  },
  honorsList: {
    gap: 10,
  },
  honorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface_elevated,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  honorIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  honorTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.text_primary,
    letterSpacing: 0.5,
  },
  honorSub: {
    fontSize: 11,
    color: Colors.text_tertiary,
    marginTop: 2,
  },
  goldBadge: {
    backgroundColor: Colors.orange_900 + '60',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  goldBadgeText: {
    color: Colors.orange_400,
    fontSize: 10,
    fontWeight: '900',
  },
  topScorerBadge: {
    backgroundColor: Colors.brand_primary + '30',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  topScorerBadgeText: {
    color: Colors.brand_primary,
    fontSize: 10,
    fontWeight: '900',
  },
  emptyHonorsCard: {
    backgroundColor: Colors.surface_elevated,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    borderStyle: 'dashed',
    gap: 4,
  },
  emptyHonorsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text_secondary,
    marginTop: 6,
  },
  emptyHonorsSub: {
    fontSize: 11,
    color: Colors.text_tertiary,
    textAlign: 'center',
  },
});
