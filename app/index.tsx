import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { Redirect } from "expo-router";

export default function Index() {
  const { status } = useAuthStore();

  if (status === "authenticated") {
    return <Redirect href='/winnix/tabs/dashboard' />;
    // return <Redirect href='/winnix/(home)' />;
  }

  return <Redirect href='/auth/login' />;
}
