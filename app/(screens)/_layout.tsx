import { ToastProvider } from "@/components/toast";
import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function ScreenLayout() {
  return (
    <KeyboardProvider>
      <ToastProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="on-boarding" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(default)" />
        </Stack>
      </ToastProvider>
    </KeyboardProvider>
  );
}
