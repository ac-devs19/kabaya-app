import { useAuthContext } from "@/contexts/auth-context";
import { VerifyProvider } from "@/contexts/verify-context";
import { Redirect, Stack } from "expo-router";

export default function DefaultLayout() {
  const { user } = useAuthContext();

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <VerifyProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(pages)" />
      </Stack>
    </VerifyProvider>
  );
}
