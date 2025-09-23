import "@/global.css";

import * as React from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import { Stack } from "expo-router";
import { NAV_THEME } from "@/lib/theme";
import { StatusBar } from "expo-status-bar";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/auth-context";
import { LoaderProvider } from "@/contexts/loader-context";
import { ToastProvider } from "@/components/toast";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [loaded, error] = useFonts({
    "Figtree-Bold": require("@/assets/fonts/Figtree-Bold.ttf"),
    "Figtree-ExtraBold": require("@/assets/fonts/Figtree-ExtraBold.ttf"),
    "Figtree-Medium": require("@/assets/fonts/Figtree-Medium.ttf"),
    "Figtree-Regular": require("@/assets/fonts/Figtree-Regular.ttf"),
    "Figtree-SemiBold": require("@/assets/fonts/Figtree-SemiBold.ttf"),
  });

  React.useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LoaderProvider>
          <ToastProvider>
            <AuthProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="(screens)" />
              </Stack>
              <PortalHost />
            </AuthProvider>
          </ToastProvider>
        </LoaderProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
