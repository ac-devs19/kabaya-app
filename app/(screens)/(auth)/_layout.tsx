import { Icon } from "@/components/ui/icon";
import { useAuthContext } from "@/contexts/auth-context";
import { Redirect, router, Stack } from "expo-router";
import { ArrowLeft, ChevronLeft } from "lucide-react-native";
import { Platform, TouchableOpacity } from "react-native";

export default function AuthLayout() {
  const { user } = useAuthContext();

  if (user) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerBackVisible: false,
        headerLeft: () => {
          if (router.canGoBack()) {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.back()}
              >
                <Icon
                  as={Platform.OS === "ios" ? ChevronLeft : ArrowLeft}
                  size={24}
                  strokeWidth={1.5}
                  className="text-primary"
                />
              </TouchableOpacity>
            );
          }
        },
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTitle: "",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="sign-in"
      />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="password" />
    </Stack>
  );
}
