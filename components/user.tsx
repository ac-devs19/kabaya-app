import { Image, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { BadgeCheck, BadgeX } from "lucide-react-native";
import { useAuthContext } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export default function User() {
  const { user } = useAuthContext();

  return (
    <View className="flex-1 flex-row items-center gap-2">
      <Image
        source={require("@/assets/images/user.png")}
        className="size-12 rounded-full"
      />
      <View className="flex-1 gap-1">
        <Text className="text-sm text-primary font-figtree-semibold">
          {user?.is_verified ? `Hi, ${user?.first_name}` : "Welcome"}
        </Text>
        <Badge
          className={cn(
            "self-start",
            user?.is_verified
              ? "bg-blue-500 dark:bg-blue-600"
              : "bg-destructive"
          )}
        >
          <Icon
            as={user?.is_verified ? BadgeCheck : BadgeX}
            className="text-white"
          />
          <Text className="font-figtree-semibold">
            {user?.is_verified ? "Verified" : "Not Verified"}
          </Text>
        </Badge>
      </View>
    </View>
  );
}
