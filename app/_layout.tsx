import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import "@/i18n/config/i18n.config";
import { useColorScheme } from "@/presentation/theme/hooks//useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export default function RootLayout() {
  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    // <GestureHandlerRootView>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='auth' />
          <Stack.Screen name='winnix' />
        </Stack>
        <StatusBar style='auto' />
      </ThemeProvider>
    </QueryClientProvider>
    // </GestureHandlerRootView>
  );
}
