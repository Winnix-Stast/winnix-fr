import { useRouter } from 'expo-router';
import { useProfile } from '@/presentation/hooks/profile/useProfile';
import { EditProfileModal } from '@/presentation/profile/components/EditProfileModal';

export default function EditProfileScreen() {
  const router = useRouter();
  const {
    user,
    activeTab,
    control,
    handleSubmit,
    errors,
    avatarUri,
    handlePickAvatar,
    onUpdateProfile,
    isSubmitting,
  } = useProfile();

  const handleClose = () => {
    router.back();
  };

  const handleSave = async (data: any) => {
    await onUpdateProfile(data);
    router.back();
  };

  return (
    <EditProfileModal
      visible={true}
      onClose={handleClose}
      user={user}
      activeRoleTab={activeTab}
      control={control}
      handleSubmit={handleSubmit}
      errors={errors}
      avatarUri={avatarUri}
      onPickAvatar={handlePickAvatar}
      onSave={handleSave}
      isSubmitting={isSubmitting}
    />
  );
}
