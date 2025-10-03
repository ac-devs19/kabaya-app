import { useAuthContext } from "@/contexts/auth-context";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import AppLogo from "@/components/app-logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WifiOff } from "lucide-react-native";
import { useNetworkState } from "expo-network";

export default function SplashScreen() {
  const { user, loading } = useAuthContext();
  const networkState = useNetworkState();

  return !networkState.isConnected || loading ? (
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
      {!networkState.isConnected && (
        <View className="absolute bottom-8 px-4">
          <Alert icon={WifiOff}>
            <AlertTitle className="font-figtree-medium">
              Network Error
            </AlertTitle>
            <AlertDescription className="text-sm font-figtree-regular">
              Something went wrong with your network connection. Please check it
              and try again.
            </AlertDescription>
          </Alert>
        </View>
      )}
    </SafeAreaView>
  ) : user ? (
    <Redirect href="/home" />
  ) : (
    <Redirect href="/on-boarding" />
  );
}
