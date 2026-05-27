import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconName, WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';

export type ActivityType = 'match' | 'team' | 'player';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
}

interface Props {
  activities: Activity[];
}

const getIconConfig = (type: ActivityType) => {
  switch (type) {
    case 'match':
      return { name: 'game-controller-outline' as const, color: Colors.brand_secondary };
    case 'team':
      return { name: 'people-outline' as const, color: Colors.brand_primary };
    case 'player':
      return { name: 'person-outline' as const, color: '#FBBF24' }; // Gold
    default:
      return { name: 'notifications-outline' as const, color: Colors.text_tertiary };
  }
};

export const RecentActivityCard: React.FC<Props> = ({ activities }) => {
  return (
    <View style={styles.container}>
      {/* High-Tech Header */}
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <WinnixIcon name='notifications-outline' size={18} color='#FBBF24' />
        </View>
        <Text style={styles.headerText}>ACTIVIDAD RECIENTE</Text>
        <View style={styles.headerLine} />
      </View>

      {/* Activities Feed */}
      <View style={styles.feed}>
        {activities.slice(0, 3).map((activity) => {
          const icon = getIconConfig(activity.type);
          return (
            <View key={activity.id} style={styles.row}>
              <View style={[styles.iconBox, { borderColor: `${icon.color}20` }]}>
                <WinnixIcon name={icon.name as IconName} size={18} color={icon.color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
                  {activity.title}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode='tail'>
                  {activity.subtitle}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  iconBadge: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.1)',
  },
  headerText: {
    color: Colors.text_primary,
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginLeft: 6,
  },
  feed: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface_elevated,
    borderColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  iconBox: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  title: {
    color: Colors.text_primary,
    fontSize: 13,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.text_tertiary,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
