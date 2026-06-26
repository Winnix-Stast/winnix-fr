import { Redirect, useLocalSearchParams } from 'expo-router';

const BrandDetailRedirect = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`/winnix/myZone/organizer/brands/${id}`} />;
};

export default BrandDetailRedirect;
