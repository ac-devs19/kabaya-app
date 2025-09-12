import { Icon } from "@/components/ui/icon";
import { useAuthContext } from "@/contexts/auth-context";
import { Redirect, router, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

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
                  as={ChevronLeft}
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
