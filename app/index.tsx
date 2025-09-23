import { useAuthContext } from "@/contexts/auth-context";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import AppLogo from "@/components/app-logo";

export default function SplashScreen() {
  const { user, loading } = useAuthContext();

  return loading ? (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center">
        <AppLogo className="w-[200px] h-20" />
        <LottieView
          style={{
            width: 150,
            height: 150,
          }}
          source={require("@/assets/animations/liquid-4-dot-loader.json")}
          autoPlay
          loop
        />
      </View>
    </SafeAreaView>
  ) : user ? (
    <Redirect href="/home" />
  ) : (
    <Redirect href="/on-boarding" />
  );
}
