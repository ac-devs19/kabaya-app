import { Icon } from "@/components/ui/icon";
import { router, Stack } from "expo-router";
import { ArrowLeft, ChevronLeft } from "lucide-react-native";
import { Platform, TouchableOpacity } from "react-native";

export default function SettingLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerBackVisible: false,
        headerTitleStyle: {
          fontFamily: "Figtree-SemiBold",
          fontSize: 18,
        },
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
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Settings",
        }}
      />
      <Stack.Screen
        name="privacy-security"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
