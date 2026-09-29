import { StyleSheet, View } from 'react-native';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { CustomText } from '@/presentation/theme/components/CustomText';
import { GradientContainer } from '@/presentation/theme/components/GradientCard';

interface Props {
  fieldAddress?: string;
}

export const InfoLocationCard = ({ fieldAddress }: Props) => {
  if (!fieldAddress || !fieldAddress.trim()) {
    return null;
  }

  return (
    <GradientContainer
      colors={['rgba(251, 191, 36, 0.14)', 'rgba(10, 16, 38, 0.95)']}
      borderColor='rgba(251, 191, 36, 0.4)'
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <WinnixIcon name='location' size={24} color='#FBBF24' />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <View style={styles.tagBadge}>
                <CustomText
                  label='CANCHA Y SEDE OFICIAL'
                  size={10}
                  weight='bold'
                  color='#FBBF24'
                  style={{ letterSpacing: 0.8 }}
                />
              </View>
            </View>
            <CustomText
              label='Sede del Torneo'
              size={18}
              weight='bold'
              color={Colors.text_primary}
            />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Address Body */}
        <View style={styles.addressBody}>
          <WinnixIcon name='navigate-outline' size={22} color={Colors.brand_primary} />
          <View style={{ flex: 1, gap: 2 }}>
            <CustomText
              label='Dirección de la Cancha'
              size={12}
              color={Colors.text_tertiary}
              weight='600'
            />
            <CustomText
              label={fieldAddress}
              size={16}
              weight='bold'
              color='#FFFFFF'
              style={{ lineHeight: 22 }}
            />
          </View>
        </View>
      </View>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(251, 191, 36, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  tagBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
  },
  addressBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
});
