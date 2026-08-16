import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
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

  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'active' | 'upcoming' | 'finished'
  >('all');

  const filterChips = [
    { key: 'all', label: 'TODOS', icon: 'grid-outline' },
    { key: 'active', label: 'ACTIVOS', icon: 'flash-outline' },
    { key: 'upcoming', label: 'PRÓXIMAMENTE', icon: 'time-outline' },
    { key: 'finished', label: 'FINALIZADOS', icon: 'checkmark-done-outline' },
  ];

  const getStatusPriority = (status?: string) => {
    const s = (status || '').toUpperCase();
    if (['REGISTRATION_OPEN', 'ACTIVE', 'IN_PROGRESS', 'PUBLISHED'].includes(s)) return 1;
    if (['DRAFT', 'UPCOMING'].includes(s)) return 2;
    if (['FINISHED', 'CANCELLED'].includes(s)) return 3;
    return 4;
  };

  const filteredEditions = useMemo(() => {
    if (!editions) return [];

    let list = [...editions];

    if (selectedFilter === 'active') {
      list = list.filter((e) =>
        ['REGISTRATION_OPEN', 'ACTIVE', 'IN_PROGRESS', 'PUBLISHED'].includes(
          (e.status || '').toUpperCase(),
        ),
      );
    } else if (selectedFilter === 'upcoming') {
      list = list.filter((e) =>
        ['DRAFT', 'UPCOMING'].includes((e.status || '').toUpperCase()),
      );
    } else if (selectedFilter === 'finished') {
      list = list.filter((e) =>
        ['FINISHED', 'CANCELLED'].includes((e.status || '').toUpperCase()),
      );
    }

    return list.sort((a, b) => {
      const pA = getStatusPriority(a.status);
      const pB = getStatusPriority(b.status);
      if (pA !== pB) return pA - pB;
      return new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime();
    });
  }, [editions, selectedFilter]);

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

          {/* Editions Section Header */}
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

          {/* E-Sports Filter Chips */}
          {editions && editions.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChipsContainer}
            >
              {filterChips.map((chip) => {
                const isActive = selectedFilter === chip.key;
                return (
                  <TouchableOpacity
                    key={chip.key}
                    style={[styles.chipButton, isActive && styles.activeChipButton]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedFilter(chip.key as any)}
                  >
                    <WinnixIcon
                      name={chip.icon as any}
                      size={14}
                      color={isActive ? '#28D1C3' : '#6E7C96'}
                    />
                    <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {loadingEditions ? (
            <ActivityIndicator size='small' color={Colors.primary} />
          ) : filteredEditions && filteredEditions.length > 0 ? (
            <View style={{ gap: 14 }}>
              {filteredEditions.map((edition: any) => {
                const st = statusLabel(edition.status);
                const thumbUri = edition.image || edition.logo;
                return (
                  <TouchableOpacity
                    key={edition._id}
                    style={[
                      styles.editionCard,
                      {
                        shadowColor: st.color,
                        borderColor: `${st.color}35`,
                      },
                    ]}
                    activeOpacity={0.85}
                    onPress={() => router.push(`/winnix/tournament/${edition._id}`)}
                  >
                    <View style={styles.editionHeaderRow}>
                      {/* Left Thumbnail Image or Icon */}
                      <View style={styles.editionThumbContainer}>
                        {thumbUri ? (
                          <Image
                            source={{ uri: thumbUri }}
                            style={styles.editionThumbImage}
                            resizeMode='cover'
                          />
                        ) : (
                          <View
                            style={[
                              styles.editionThumbIconBg,
                              { backgroundColor: st.color + '15' },
                            ]}
                          >
                            <WinnixIcon
                              name='trophy-outline'
                              size={22}
                              color={st.color}
                            />
                          </View>
                        )}
                      </View>

                      {/* Main Title & Details */}
                      <View style={styles.editionMainInfo}>
                        <View style={styles.editionTitleRow}>
                          <Text style={styles.editionName} numberOfLines={1}>
                            {edition.seasonName}
                          </Text>
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor: st.color + '15',
                                borderColor: st.color + '40',
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
                            {edition.endDate
                              ? formatDate(edition.endDate)
                              : 'Sin definir'}
                          </Text>
                        </View>
                      </View>

                      {/* Chevron Arrow */}
                      <WinnixIcon
                        name='chevron-forward-outline'
                        size={20}
                        color='#6E7C96'
                      />
                    </View>
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
  filterChipsContainer: {
    gap: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10, 15, 38, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeChipButton: {
    backgroundColor: 'rgba(40, 209, 195, 0.12)',
    borderColor: '#28D1C3',
    shadowColor: '#28D1C3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6E7C96',
    letterSpacing: 0.8,
  },
  activeChipText: {
    color: '#28D1C3',
  },
  editionCard: {
    backgroundColor: '#0c122b',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  editionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editionThumbContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#161e38',
  },
  editionThumbImage: {
    width: '100%',
    height: '100%',
  },
  editionThumbIconBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  editionMainInfo: {
    flex: 1,
    gap: 6,
  },
  editionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  editionName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    flex: 1,
    letterSpacing: 0.3,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  editionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editionDate: {
    fontSize: 12,
    color: '#9EADCE',
    fontWeight: '600',
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
