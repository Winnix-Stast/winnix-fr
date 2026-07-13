import { Redirect, useLocalSearchParams } from 'expo-router';

const BrandDetailRedirect = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`/winnix/brand/${id}`} />;
};

export default BrandDetailRedirect;
