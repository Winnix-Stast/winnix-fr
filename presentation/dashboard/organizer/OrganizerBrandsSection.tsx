import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';

interface OrganizerBrandsSectionProps {
  brands: any[];
  onPressBrand: (brand: any) => void;
  onPressSeeAll: () => void;
}

export const OrganizerBrandsSection = ({
  brands,
  onPressBrand,
  onPressSeeAll,
}: OrganizerBrandsSectionProps) => {
  const hasBrands = brands.length > 0;

  if (!hasBrands) {
    return null;
  }

  return (
    <View style={styles.brandsSectionContainer}>
      <View style={[styles.sectionHeader, { marginTop: 32, marginBottom: 12 }]}>
        <Text style={styles.sectionTitle}>Mis Marcas ({brands.length})</Text>
        <TouchableOpacity onPress={onPressSeeAll}>
          <Text style={styles.seeAllText}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalBrandsList}
      >
        {brands.map((item: any) => {
          const handlePress = () => onPressBrand(item);

          return (
            <TouchableOpacity
              key={item._id}
              style={styles.compactBrandChip}
              activeOpacity={0.8}
              onPress={handlePress}
            >
              <View style={styles.brandChipAvatar}>
                {item.logo ? (
                  <Image source={{ uri: item.logo }} style={styles.brandChipLogo} />
                ) : (
                  <WinnixIcon
                    name='trophy-outline'
                    size={18}
                    color={Colors.brand_primary}
                  />
                )}
              </View>
              <Text style={styles.brandChipName} numberOfLines={1}>
                {item.name}
              </Text>
              <WinnixIcon
                name='chevron-forward-outline'
                size={16}
                color={Colors.text_tertiary}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  brandsSectionContainer: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  seeAllText: {
    fontSize: 16,
    color: Colors.brand_primary,
    fontWeight: '600',
  },
  horizontalBrandsList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  compactBrandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  brandChipAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  brandChipLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  brandChipName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text_primary,
    maxWidth: 140,
  },
});
