import { Image } from "react-native";

export default function AppLogo() {
  return (
    <Image
      resizeMode="contain"
      source={require("@/assets/images/logo.png")}
      className="w-[120px] h-10"
    />
  );
}
