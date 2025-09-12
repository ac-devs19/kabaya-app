import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useAuthContext } from "@/contexts/auth-context";
import { SquarePen } from "lucide-react-native";
import { Image, ScrollView, View } from "react-native";

export default function PersonalInformation() {
  const { user } = useAuthContext();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
      }}
    >
      <View className="gap-8">
        <View className="items-center gap-2">
          <Image
            source={require("@/assets/images/user.png")}
            className="size-20 rounded-full"
          />
          <Button variant="secondary" className="h-6 py-0 px-2">
            <Text className="font-figtree-medium text-xs text-primary">
              Change Photo
            </Text>
            <Icon as={SquarePen} strokeWidth={1.5} className="text-primary" />
          </Button>
          <Text className="font-figtree-semibold text-center">
            {user?.first_name} {user?.middle_name} {user?.last_name}{" "}
            {user?.suffix}
          </Text>
        </View>
        <View className="gap-6">
          <View className="gap-4">
            <View className="gap-1">
              <Label className="font-figtree-medium text-xs text-muted-foreground">
                Birth Date
              </Label>
              <Text className="font-figtree-regular">
                {new Date(user?.birth_date as Date)
                  .toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  .toUpperCase()}
              </Text>
            </View>
            <Separator />
          </View>
          <View className="gap-4">
            <View className="gap-1">
              <Label className="font-figtree-medium text-xs text-muted-foreground">
                Email Address
              </Label>
              <Text className="font-figtree-regular">{user?.email}</Text>
            </View>
            <Separator />
          </View>
          <View className="gap-4">
            <View className="gap-1">
              <Label className="font-figtree-medium text-xs text-muted-foreground">
                Phone Number
              </Label>
              <Text className="font-figtree-regular">
                +63{user?.phone_number}
              </Text>
            </View>
            <Separator />
          </View>
          <View className="gap-4">
            <View className="gap-1">
              <Label className="font-figtree-medium text-xs text-muted-foreground">
                Current Address
              </Label>
              <Text className="font-figtree-regular">
                {user?.street_name}, {user?.barangay}, {user?.municipality},{" "}
                {user?.province}, {user?.postal_code}
              </Text>
              <Button
                variant="secondary"
                className="h-6 py-0 px-2 self-start mt-1"
              >
                <Text className="font-figtree-medium text-xs text-primary">
                  Change Address
                </Text>
                <Icon
                  as={SquarePen}
                  strokeWidth={1.5}
                  className="text-primary"
                />
              </Button>
            </View>
            <Separator />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
