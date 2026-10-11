import { useCallback, useEffect, useState } from 'react';
import { Clipboard } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { filesAdapter } from '@/core/files/files-adapter';
import { profileActions } from '@/core/profile/actions/profile-actions';
import { tournamentsActions } from '@/core/tournaments/actions/tournaments-actions';
import { useCustomForm } from '@/hooks/useCustomForm';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
import { useMyBrands } from '@/presentation/hooks/brands/useMyBrands';
import { useMyInscriptions } from '@/presentation/hooks/inscriptions/useMyInscriptions';
import { ProfileFormValues, profileSchema } from '@/presentation/schemas/profileSchema';

export type ProfileRoleTab = 'organizador' | 'carrera' | 'juez' | 'dt';

export interface UserRoleOption {
  id: ProfileRoleTab;
  label: string;
  icon: string;
}

export const useProfile = (targetUserId?: string) => {
  const { user: authUser, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwnProfile =
    !targetUserId ||
    targetUserId === authUser?.id ||
    targetUserId === (authUser as any)?._id;

  // Fetch fresh profile data directly from server CRUD endpoint
  const { data: profileData, refetch: refetchProfile } = useQuery({
    queryKey: ['user-profile', targetUserId || 'self'],
    queryFn: () =>
      profileActions.getUserProfileAction(isOwnProfile ? undefined : targetUserId),
  });

  // Fetch organizer editions / tournaments only for own profile or enabled
  const { data: myEditionsData, isLoading: loadingEditions } = useQuery({
    queryKey: ['my-editions', targetUserId || 'self'],
    queryFn: () => tournamentsActions.getMyEditionsAction(),
    enabled: isOwnProfile,
  });

  const myEditions = Array.isArray(myEditionsData) ? myEditionsData : [];
  const user = isOwnProfile ? profileData || authUser : profileData || null;
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatar || null);

  // Compute available role options based on target user's roles
  const availableRoleTabs = useCallback((): UserRoleOption[] => {
    const rawRoleStrings = [
      ...(Array.isArray(user?.roles)
        ? user.roles.map((r: any) => (typeof r === 'object' ? r?.name || r?.label : r))
        : [user?.roles]),
      ...(Array.isArray((user as any)?.roleEntities)
        ? (user as any).roleEntities.map((r: any) => r?.name || r?.label)
        : []),
      (user as any)?.role,
      (user as any)?.roleType,
    ]
      .filter(Boolean)
      .map((r: any) => String(r).toUpperCase());

    const isOrganizerRole = rawRoleStrings.some(
      (r) =>
        r.includes('ORGANIZ') ||
        r.includes('BRAND') ||
        r.includes('MARCA') ||
        r.includes('MANAGER'),
    );
    const isPlayerRole = rawRoleStrings.some(
      (r) =>
        r.includes('PLAY') ||
        r.includes('JUGAD') ||
        r.includes('CAPTA') ||
        r.includes('DEPORTIST'),
    );
    const isJudgeRole = rawRoleStrings.some(
      (r) =>
        r.includes('JUDG') ||
        r.includes('JUEZ') ||
        r.includes('ARBITR') ||
        r.includes('REFEREE'),
    );
    const isDtRole = rawRoleStrings.some(
      (r) => r.includes('DT') || r.includes('COACH') || r.includes('TECNIC'),
    );

    const options: UserRoleOption[] = [];

    if (isOrganizerRole) {
      options.push({ id: 'organizador', label: 'ORGANIZADOR', icon: 'briefcase' });
    }
    if (isPlayerRole) {
      options.push({ id: 'carrera', label: 'CARRERA DEPORTIVA', icon: 'person' });
    }
    if (isJudgeRole) {
      options.push({ id: 'juez', label: 'ÁRBITRO / JUEZ', icon: 'ribbon' });
    }
    if (isDtRole) {
      options.push({ id: 'dt', label: 'DIRECTOR TÉCNICO', icon: 'clipboard' });
    }

    // Default fallbacks if no specific roles match
    if (options.length === 0) {
      const emailOrName = (
        user?.email ||
        user?.nickname ||
        user?.username ||
        ''
      ).toLowerCase();
      if (emailOrName.includes('organiz')) {
        options.push({ id: 'organizador', label: 'ORGANIZADOR', icon: 'briefcase' });
      } else {
        options.push({ id: 'carrera', label: 'CARRERA DEPORTIVA', icon: 'person' });
      }
    }

    return options;
  }, [user])();

  const [activeTab, setActiveTab] = useState<ProfileRoleTab>(availableRoleTabs[0]?.id);

  // Update activeTab when availableRoleTabs change
  useEffect(() => {
    if (availableRoleTabs.length > 0) {
      if (!availableRoleTabs.some((tab) => tab.id === activeTab)) {
        setActiveTab(availableRoleTabs[0].id);
      }
    }
  }, [availableRoleTabs]);

  // Stats / Likes state
  const initialLikes = (user as any)?.likesCount ?? (user as any)?.likes ?? 0;
  const [likes, setLikes] = useState<number>(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const freshLikes = (user as any)?.likesCount ?? (user as any)?.likes ?? 0;
    setLikes(freshLikes);
  }, [user]);

  // Fetch organizer brands only for own profile
  const { brands = [], loading: loadingBrands, refresh: refreshBrands } = useMyBrands();

  // Fetch player inscriptions only for own profile
  const { inscriptions = [], loading: loadingInscriptions } = useMyInscriptions();

  const brandsCount = isOwnProfile
    ? brands.length
    : ((user as any)?.brandsCount ?? (user as any)?.brands?.length ?? 0);
  const editionsCount = isOwnProfile
    ? myEditions.length
    : ((user as any)?.editionsCount ?? (user as any)?.editions?.length ?? 0);
  const inscriptionsCount = isOwnProfile
    ? inscriptions.length
    : ((user as any)?.inscriptionsCount ?? (user as any)?.inscriptions?.length ?? 0);

  // Custom Form initialization
  const { control, handleSubmit, errors, setValue, reset } =
    useCustomForm<ProfileFormValues>(profileSchema);

  // Populate form when modal opens or user updates
  useEffect(() => {
    const currentUser = profileData || authUser;
    if (currentUser) {
      const rawBirthDate =
        (currentUser as any)?.birthDate ||
        (currentUser as any)?.birth_date ||
        (currentUser as any)?.dateOfBirth;
      const parsedBirthDate = rawBirthDate ? new Date(rawBirthDate) : undefined;
      const rawPhone =
        currentUser?.phoneNumber ||
        (currentUser as any)?.phone ||
        (currentUser as any)?.contact?.phone;
      const parsedPhone = rawPhone ? Number(rawPhone) || undefined : undefined;

      setAvatarUri(currentUser.avatar || null);
      reset({
        username: currentUser.username || '',
        email: currentUser.email || '',
        nickname: currentUser.nickname || '',
        documentType: currentUser.documentType || '',
        idNumber: currentUser.idNumber || undefined,
        country: currentUser.country || '',
        city: currentUser.city || '',
        neighborhood: currentUser.neighborhood || '',
        birthDate:
          parsedBirthDate && !isNaN(parsedBirthDate.getTime())
            ? parsedBirthDate
            : undefined,
        phoneNumber: parsedPhone,
        avatar: currentUser.avatar || '',
      });
    }
  }, [profileData, authUser, isEditing]);

  const uniqueCode = user?.id
    ? `WNX-${user.id.substring(user.id.length - 6).toUpperCase()}`
    : 'WNX-X7Y9Q';

  const toggleLike = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHasLiked((prev) => {
      setLikes((curr) => (prev ? curr - 1 : curr + 1));
      return !prev;
    });
  }, []);

  const copyUniqueCode = useCallback(() => {
    Clipboard.setString(uniqueCode);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedCode(true);
    useAlertStore.getState().showAlert({
      title: '¡Código Copiado!',
      message: `Se copió tu código único ${uniqueCode} al portapapeles.`,
      type: 'success',
      confirmText: 'Genial',
    });
    setTimeout(() => setCopiedCode(false), 3000);
  }, [uniqueCode]);

  const openEditModal = () => {
    if (!isOwnProfile) {
      return;
    }
    setIsEditing(true);
  };
  const closeEditModal = () => {
    setIsEditing(false);
  };

  const handlePickAvatar = async () => {
    if (!isOwnProfile) return;
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        useAlertStore.getState().showAlert({
          title: 'Permiso denegado',
          message: 'Necesitamos acceso a tus fotos para cambiar la foto de perfil.',
          type: 'warning',
          confirmText: 'Entendido',
        });
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets?.[0]?.uri) {
        const localUri = pickerResult.assets[0].uri;
        setAvatarUri(localUri);
        setValue('avatar', localUri);
      }
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const onUpdateProfile = async (formData: ProfileFormValues) => {
    if (!isOwnProfile) {
      return;
    }
    console.log(formData);

    // Validate age for Organizador, Juez / Árbitro, or Patrocinador roles (Must be >= 18)
    if (formData.birthDate) {
      const birth = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }

      const isRestrictiveRole =
        activeTab === 'organizador' ||
        user?.roles?.some((r: string) =>
          [
            'ORGANIZER',
            'JUDGE',
            'SPONSOR',
            'ORGANIZADOR',
            'JUEZ',
            'PATROCINADOR',
          ].includes(String(r).toUpperCase()),
        );

      if (isRestrictiveRole && age < 18) {
        useAlertStore.getState().showAlert({
          title: 'Restricción de Edad',
          message:
            'Los usuarios con rol de Organizador, Árbitro o Patrocinador deben ser mayores de 18 años.',
          type: 'warning',
          confirmText: 'Entendido',
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let finalAvatarUrl = user?.avatar;

      if (avatarUri && avatarUri.startsWith('file:')) {
        const uploadRes = await filesAdapter.uploadFile(avatarUri, 'avatars');
        console.log(uploadRes);
        finalAvatarUrl = uploadRes.url;
      }

      const payload = {
        username: formData.username,
        email: formData.email,
        nickname: formData.nickname,
        documentType: formData.documentType,
        idNumber: formData.idNumber ?? undefined,
        country: formData.country,
        city: formData.city,
        neighborhood: formData.neighborhood,
        birthDate: formData.birthDate ? formData.birthDate.toISOString() : undefined,
        phoneNumber: formData.phoneNumber ?? undefined,
        avatar: finalAvatarUrl,
      };

      console.log(payload);
      const updateResult = await profileActions.updateProfileAction(payload as any);
      console.log(updateResult);

      await refetchProfile();

      // Update auth store with updated user profile details
      updateUser({
        username: formData.username || user?.username,
        email: formData.email || user?.email,
        nickname: formData.nickname || user?.nickname,
        avatar: finalAvatarUrl || user?.avatar,
      });

      closeEditModal();
    } catch (error: any) {
      const rawMsg =
        error?.message ||
        error?.response?.data?.message ||
        'No se pudo actualizar el perfil.';
      const msg = Array.isArray(rawMsg) ? rawMsg.join('\n') : String(rawMsg);
      useAlertStore.getState().showAlert({
        title: 'Error al actualizar',
        message: msg,
        type: 'error',
        confirmText: 'Entendido',
      });
    } finally {
      console.log();
      setIsSubmitting(false);
    }
  };

  return {
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
    refreshBrands,
    myEditions,
    editionsCount,
    loadingEditions,
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
  };
};
