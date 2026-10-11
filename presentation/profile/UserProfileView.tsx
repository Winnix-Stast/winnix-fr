import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { useProfile } from '../hooks/profile/useProfile';
import { EditProfileModal } from './components/EditProfileModal';
import { ProfileHeaderHero } from './components/ProfileHeaderHero';
import { ProfileOrganizerSection } from './components/ProfileOrganizerSection';
import { ProfilePlayerSection } from './components/ProfilePlayerSection';
import { ProfileRoleSelector } from './components/ProfileRoleSelector';

interface Props {
  userId?: string;
}

export const UserProfileView: React.FC<Props> = ({ userId }) => {
  const router = useRouter();
  const {
    user,
    uniqueCode,
    isOwnProfile,
    availableRoleTabs,
    activeTab,
    setActiveTab,
    likes,
    hasLiked,
    copiedCode,
    toggleLike,
    copyUniqueCode,
    brands,
    brandsCount,
    loadingBrands,
    editionsCount,
    inscriptions,
    inscriptionsCount,
    loadingInscriptions,
    isEditing,
    openEditModal,
    closeEditModal,
    control,
    handleSubmit,
    errors,
    avatarUri,
    handlePickAvatar,
    onUpdateProfile,
    isSubmitting,
  } = useProfile(userId);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Hero Card with dynamic role customization */}
        <ProfileHeaderHero
          user={user}
          uniqueCode={uniqueCode}
          likes={likes}
          hasLiked={hasLiked}
          copiedCode={copiedCode}
          onToggleLike={toggleLike}
          onCopyCode={copyUniqueCode}
          activeTab={activeTab}
          brandsCount={brandsCount}
          editionsCount={editionsCount}
          inscriptionsCount={inscriptionsCount}
          isOwnProfile={isOwnProfile}
          onBack={!isOwnProfile ? () => router.back() : undefined}
        />

        {/* Perspective Role Selector Tabs */}
        <ProfileRoleSelector
          availableRoleTabs={availableRoleTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Active Perspective Section */}
        {activeTab === 'organizador' ? (
          <ProfileOrganizerSection
            brands={brands}
            loadingBrands={loadingBrands}
            inscriptionsCount={inscriptionsCount}
            editionsCount={editionsCount}
          />
        ) : (
          <ProfilePlayerSection
            user={user}
            inscriptions={inscriptions}
            loadingInscriptions={loadingInscriptions}
            isOwnProfile={isOwnProfile}
          />
        )}
      </ScrollView>

      {/* Floating Pencil Button (FAB) - Validated only for own profile editing */}
      {isOwnProfile && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={openEditModal}
          style={styles.floatingEditBtn}
        >
          <WinnixIcon name='pencil' size={24} color={Colors.surface_base} />
        </TouchableOpacity>
      )}

      {/* Edit Profile Modal (Only operable by own profile) */}
      {isOwnProfile && (
        <EditProfileModal
          visible={isEditing}
          onClose={closeEditModal}
          user={user}
          activeRoleTab={activeTab}
          control={control}
          handleSubmit={handleSubmit}
          errors={errors}
          avatarUri={avatarUri}
          onPickAvatar={handlePickAvatar}
          onSave={onUpdateProfile}
          isSubmitting={isSubmitting}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface_screen,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  floatingEditBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.brand_primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 99,
  },
});
