import { View } from "react-native";
import LottieView from "lottie-react-native";

export default function Notifications() {
  return (
    <View className="flex-1 items-center justify-center">
      <LottieView
        autoPlay
        style={{
          width: 150,
          height: 150,
        }}
        source={require("@/assets/animations/empty-box.json")}
      />
    </View>
  );
}
