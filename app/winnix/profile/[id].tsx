import { useLocalSearchParams } from 'expo-router';
import { UserProfileView } from '@/presentation/profile/UserProfileView';

export default function UserProfileByIdScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <UserProfileView userId={id} />;
}
