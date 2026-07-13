import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ScreenHeader } from '@/presentation/components/customs';
import { useBrandDetails } from '@/presentation/hooks/brands/useBrandDetails';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/global-styles';
import { PermissionGate } from '@/presentation/theme/components';
import { CustomFormView } from '@/presentation/theme/components/CustomFormView';
import { CustomText } from '@/presentation/theme/components/CustomText';

export const BrandDetailScreen = () => {
  const {
    resolvedId,
    router,
    brand,
    loadingBrand,
    editions,
    loadingEditions,
    formatDate,
    statusLabel,
  } = useBrandDetails();

  if (loadingBrand) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }

  if (!brand) {
    return (
      <View style={styles.centered}>
        <CustomText label='No se encontró la marca' color={Colors.light} />
      </View>
    );
  }

  return (
    <CustomFormView key={resolvedId as string}>
      <ScreenHeader title='' onBack={() => router.back()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20, gap: 24, paddingTop: 10 }}>
          {/* Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.brandLogoContainer}>
              <WinnixIcon name='trophy-outline' size={52} color='#28D1C3' />
            </View>
            <Text style={styles.brandName}>{brand.name}</Text>

            <View style={styles.licenseBadge}>
              <Text style={styles.licenseBadgeText}>LICENCIA OFICIAL WINNIX</Text>
            </View>

            <Text style={styles.brandMeta}>
              ID DE REGISTRO #{brand.incremental || '—'}
            </Text>
          </View>

          {/* Stats Badges Row */}
          <View style={styles.statsRow}>
            {/* Editions count */}
            <View style={[styles.statCard, { borderColor: 'rgba(99, 102, 241, 0.22)' }]}>
              <View
                style={[
                  styles.statIconWrapper,
                  { backgroundColor: 'rgba(99, 102, 241, 0.08)' },
                ]}
              >
                <WinnixIcon name='layers-outline' size={20} color='#6366F1' />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>TORNEOS</Text>
                <Text style={styles.statValue}>{editions?.length || 0}</Text>
              </View>
            </View>

            {/* Status */}
            <View
              style={[
                styles.statCard,
                {
                  borderColor: brand.isActive
                    ? 'rgba(0, 200, 151, 0.22)'
                    : 'rgba(110, 124, 150, 0.22)',
                },
              ]}
            >
              <View
                style={[
                  styles.statIconWrapper,
                  {
                    backgroundColor: brand.isActive
                      ? 'rgba(0, 200, 151, 0.08)'
                      : 'rgba(110, 124, 150, 0.08)',
                  },
                ]}
              >
                <WinnixIcon
                  name={
                    brand.isActive ? 'checkmark-circle-outline' : 'close-circle-outline'
                  }
                  size={20}
                  color={brand.isActive ? '#00c897' : '#6E7C96'}
                />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>ESTADO</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: brand.isActive ? '#00c897' : '#6E7C96' },
                  ]}
                >
                  {brand.isActive ? 'ACTIVA' : 'INACTIVA'}
                </Text>
              </View>
            </View>
          </View>

          {/* Editions Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ediciones Creadas</Text>
            <PermissionGate permission='create:tournament-edition'>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  router.push({
                    pathname: '/winnix/tournament/create',
                    params: { brandId: resolvedId as string },
                  })
                }
                activeOpacity={0.8}
              >
                <WinnixIcon name='add-circle-outline' size={16} color='#28D1C3' />
                <Text style={styles.addButtonText}>CREAR TORNEO</Text>
              </TouchableOpacity>
            </PermissionGate>
          </View>

          {loadingEditions ? (
            <ActivityIndicator size='small' color={Colors.primary} />
          ) : editions && editions.length > 0 ? (
            <View style={{ gap: 14 }}>
              {editions.map((edition: any) => {
                const st = statusLabel(edition.status);
                return (
                  <TouchableOpacity
                    key={edition._id}
                    style={[styles.editionCard, { borderLeftColor: st.color }]}
                    activeOpacity={0.855}
                    onPress={() => router.push(`/winnix/tournament/${edition._id}`)}
                  >
                    <View style={styles.editionContent}>
                      <View style={styles.editionTop}>
                        <Text style={styles.editionName} numberOfLines={1}>
                          {edition.seasonName}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: st.color + '12',
                              borderColor: st.color + '35',
                            },
                          ]}
                        >
                          <Text style={[styles.statusText, { color: st.color }]}>
                            {st.label.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.editionMeta}>
                        <WinnixIcon name='calendar-outline' size={14} color='#6E7C96' />
                        <Text style={styles.editionDate}>
                          {formatDate(edition.startDate)} —{' '}
                          {edition.endDate ? formatDate(edition.endDate) : 'Sin definir'}
                        </Text>
                      </View>
                    </View>
                    <WinnixIcon
                      name='chevron-forward-outline'
                      size={20}
                      color='#6E7C96'
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyEditions}>
              <View style={styles.emptyIconContainer}>
                <WinnixIcon name='calendar-outline' size={42} color='#6E7C96' />
              </View>
              <Text style={styles.emptyText}>Aún no hay torneos creados</Text>
              <Text style={styles.emptySubtext}>
                Arma el primer torneo bajo tu marca para convocar a los equipos
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </CustomFormView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark,
  },
  brandHeader: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    paddingBottom: 5,
  },
  brandLogoContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: 'rgba(40, 209, 195, 0.35)',
    backgroundColor: '#0a0f26',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#28D1C3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  licenseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(40, 209, 195, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.25)',
    borderRadius: 6,
    marginVertical: 4,
  },
  licenseBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#28D1C3',
    letterSpacing: 1.5,
  },
  brandMeta: {
    fontSize: 12,
    color: '#A2B4D6',
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f26',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  statIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#A2B4D6',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 209, 195, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    fontSize: 13,
    color: '#28D1C3',
    fontWeight: '900',
    letterSpacing: 1,
  },
  editionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0a0f26',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderLeftWidth: 4,
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  editionContent: {
    flex: 1,
    gap: 8,
  },
  editionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  editionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  editionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editionDate: {
    fontSize: 13,
    color: '#9EADCE',
    fontWeight: '500',
  },
  emptyEditions: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
    backgroundColor: '#0a0f26',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  emptyIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emptyText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#9EADCE',
    marginTop: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9EADCE',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 18,
  },
});
