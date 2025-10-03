import { Icon } from "@/components/ui/icon";
import { router, Stack } from "expo-router";
import { ArrowLeft, ChevronLeft } from "lucide-react-native";
import { Platform, TouchableOpacity } from "react-native";

export default function VerificationLayout() {
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
      <Stack.Screen name="identity" />
      <Stack.Screen name="address" />
      <Stack.Screen name="confirm-information" />
      <Stack.Screen name="id" />
    </Stack>
  );
}
