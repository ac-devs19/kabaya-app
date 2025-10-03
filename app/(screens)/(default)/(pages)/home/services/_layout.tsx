import { Stack } from "expo-router";

export default function ServiceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="sb" />
      <Stack.Screen name="jb" />
    </Stack>
  );
}
