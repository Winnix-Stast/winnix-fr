import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { PlayerTutorialOverlay } from '@/presentation/components/tutorials';
import { useMyTeams } from '@/presentation/hooks/teams/useMyTeams';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { CustomFormView } from '@/presentation/theme/components/CustomFormView';
import { JoinTeamCTA } from './components/JoinTeamCTA';
import { PlayerTeamCard } from './components/PlayerTeamCard';

export const PlayerDashboardView = () => {
  const { user } = useAuthStore();
  const { teams, loading, handleRespondInvitation, isRespondingInvitation } = useMyTeams();
  const [forceShowTutorial, setForceShowTutorial] = useState(false);

  const userName = user?.nickname || user?.username || 'Jugador';

  const handleExploreTeams = () => {
    router.push({
      pathname: '/winnix/tabs/(tournamentStack)',
      params: { tab: 'viewTeams' },
    });
  };

  // Animación de pálpito continuo para el botón redondo de tutorial
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <CustomFormView contentStyle={styles.containerStyle}>
        {/* 1. Clean Top Bar: Greeting + Circular Pulsing Tutorial Button */}
        <View style={styles.headerUserRow}>
          <Text style={styles.userNameText} numberOfLines={1}>
            Hola, {userName} 👋
          </Text>

          <Animated.View style={[styles.tutorialButtonContainer, pulseAnimatedStyle]}>
            <Pressable
              onPress={() => setForceShowTutorial(true)}
              style={styles.tutorialCircleButton}
              hitSlop={8}
            >
              <WinnixIcon name='help-circle-outline' size={24} color={Colors.brand_primary} />
            </Pressable>
          </Animated.View>
        </View>

        {/* 2. Main Content: Teams List or Hero CTA */}
        {loading && teams.length === 0 ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size='small' color={Colors.brand_primary} />
          </View>
        ) : teams.length > 0 ? (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleRow}>
              <WinnixIcon name='shield-checkmark-outline' size={18} color={Colors.brand_primary} />
              <Text style={styles.sectionTitleText}>MIS ESCUADRAS</Text>
            </View>

            <View style={styles.teamsListWrapper}>
              {teams.map((team: any) => (
                <PlayerTeamCard
                  key={team._id}
                  team={team}
                  currentUserId={user?.id}
                  onRespond={handleRespondInvitation}
                  isResponding={isRespondingInvitation}
                />
              ))}
            </View>
          </View>
        ) : (
          /* Permanent Hero CTA when player belongs to 0 teams */
          <JoinTeamCTA />
        )}

        {/* 3. Interactive Tutorial Overlay */}
        <PlayerTutorialOverlay
          forceShow={forceShowTutorial}
          onClose={() => setForceShowTutorial(false)}
        />
      </CustomFormView>

      {/* 4. Floating Action Button (FAB) for exploring other teams */}
      {teams.length > 0 && (
        <TouchableOpacity
          onPress={handleExploreTeams}
          activeOpacity={0.85}
          style={styles.fabButton}
        >
          <WinnixIcon name='shield-outline' size={26} color='#000000' />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
    gap: 20,
  },
  headerUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  userNameText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    flex: 1,
    marginRight: 10,
  },
  tutorialButtonContainer: {
    borderRadius: 24,
    shadowColor: '#28D1C3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  tutorialCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(40, 209, 195, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#28D1C3',
  },
  sectionContainer: {
    gap: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  loadingWrapper: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  teamsListWrapper: {
    gap: 14,
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#28D1C3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#28D1C3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
});
