import { Icon } from "@/components/ui/icon";
import { Tabs } from "expo-router";
import { Bell, Home, LayoutGrid, Newspaper } from "lucide-react-native";
import {
  Image,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: "Figtree-SemiBold",
          fontSize: 18,
          textTransform: "capitalize",
        },
        tabBarStyle: {
          borderColor: "transparent",
          backgroundColor: "#E11D480D",
          shadowColor: "transparent",
        },
        tabBarLabelStyle: {
          fontFamily: "Figtree-Medium",
          textTransform: "capitalize",
        },
        tabBarButton: (props) => (
          <TouchableOpacity
            activeOpacity={0.7}
            {...(props as TouchableOpacityProps)}
          />
        ),
      }}
    >
      <Tabs.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon as={Home} color={color} size={22} strokeWidth={1.5} />
          ),
        }}
        name="home"
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={Newspaper} color={color} size={22} strokeWidth={1.5} />
          ),
        }}
        name="news"
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={Bell} color={color} size={22} strokeWidth={1.5} />
          ),
        }}
        name="notifications"
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={LayoutGrid} color={color} size={22} strokeWidth={1.5} />
          ),
          headerBackground: () => (
            <View className="flex-1 items-end">
              <Image
                resizeMode="contain"
                source={require("@/assets/images/background-styles/geometric-border.png")}
                className="w-32 h-32"
              />
            </View>
          ),
        }}
        name="account"
      />
    </Tabs>
  );
}
