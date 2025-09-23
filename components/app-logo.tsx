import { cn } from "@/lib/utils";
import { Image, ImageProps } from "react-native";

interface AppLogoProps extends ImageProps {
  className?: string;
}

export default function AppLogo({ className, ...props }: AppLogoProps) {
  return (
    <Image
      resizeMode="contain"
      source={require("@/assets/images/logo.png")}
      className={cn("w-[120px] h-10", className)}
      {...props}
    />
  );
}
