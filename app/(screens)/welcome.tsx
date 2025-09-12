import { Text } from "@/components/ui/text";
import { useAuthContext } from "@/contexts/auth-context";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { View } from "react-native";

export default function Welcome() {
  const { user } = useAuthContext();

  return (
    <View className="flex-1 items-center justify-center">
      <LottieView
        autoPlay
        loop={false}
        style={{
          width: 200,
          height: 150,
        }}
        source={require("@/assets/animations/welcome.json")}
        onAnimationFinish={() => router.replace("/home")}
      />
      <Text className="font-figtree-semibold text-xl text-center">
        {user?.first_name} {user?.last_name} {user?.suffix}
      </Text>
    </View>
  );
}
