import { useAuthContext } from "@/contexts/auth-context";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  const { user, loading } = useAuthContext();

  return loading ? (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Text>Loading</Text>
      </View>
    </SafeAreaView>
  ) : user ? (
    <Redirect href="/home" />
  ) : (
    <Redirect href="/on-boarding" />
  );
}
