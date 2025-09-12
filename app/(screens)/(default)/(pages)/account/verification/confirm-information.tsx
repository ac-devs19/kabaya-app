import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useAuthContext } from "@/contexts/auth-context";
import { router } from "expo-router";
import { SquarePen } from "lucide-react-native";
import { View, ScrollView } from "react-native";

export default function ConfirmInformation() {
  const { user } = useAuthContext();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
        gap: 40,
        justifyContent: "space-between",
      }}
    >
      <View className="gap-6">
        <View className="gap-1">
          <Text className="font-figtree-bold text-2xl">
            Confirm Information
          </Text>
          <Text className="text-sm font-figtree-regular">
            Please make sure the details are correct.
          </Text>
        </View>
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-figtree-semibold">Personal Details</Text>
            <Button
              onPress={() => router.push("/account/verification/identity")}
              variant="secondary"
              className="h-6 py-0 px-2"
            >
              <Text className="font-figtree-medium text-xs text-primary">
                Edit Details
              </Text>
              <Icon as={SquarePen} strokeWidth={1.5} className="text-primary" />
            </Button>
          </View>
          <Separator />
          <View className="gap-2">
            <View className="flex-row">
              <Text className="w-36 font-figtree-medium text-muted-foreground text-sm">
                First Name
              </Text>
              <Text className="flex-1 font-figtree-medium text-sm">
                {user?.first_name}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-36 font-figtree-medium text-muted-foreground text-sm">
                Middle Name
              </Text>
              <Text className="flex-1 font-figtree-medium text-sm">
                {user?.middle_name ?? "N/A"}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-36 font-figtree-medium text-muted-foreground text-sm">
                Last Name
              </Text>
              <Text className="flex-1 font-figtree-medium text-sm">
                {user?.last_name}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-36 font-figtree-medium text-muted-foreground text-sm">
                Suffix
              </Text>
              <Text className="flex-1 font-figtree-medium text-sm">
                {user?.suffix ?? "N/A"}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-36 font-figtree-medium text-muted-foreground text-sm">
                Birth Date
              </Text>
              <Text className="flex-1 font-figtree-medium text-sm">
                {new Date(user?.birth_date as Date)
                  .toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  .toUpperCase()}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-36 font-figtree-medium text-muted-foreground text-sm">
                Phone Number
              </Text>
              <Text className="flex-1 font-figtree-medium text-sm">
                +63{user?.phone_number}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-36 font-figtree-medium text-muted-foreground text-sm">
                Email Address
              </Text>
              <Text className="flex-1 font-figtree-medium text-sm">
                {user?.email}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-36 font-figtree-medium text-muted-foreground text-sm">
                Sex
              </Text>
              <Text className="flex-1 font-figtree-medium text-sm">
                {user?.sex}
              </Text>
            </View>
          </View>
        </View>
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-figtree-semibold">Current Address</Text>
            <Button
              onPress={() => router.push("/account/verification/address")}
              variant="secondary"
              className="h-6 py-0 px-2"
            >
              <Text className="font-figtree-medium text-xs text-primary">
                Edit Details
              </Text>
              <Icon as={SquarePen} strokeWidth={1.5} className="text-primary" />
            </Button>
          </View>
          <Separator />
          <View className="gap-2">
            <View className="flex-row">
              <Text className="w-36 font-figtree-medium text-muted-foreground text-sm">
                Province
              </Text>
              <Text className="flex-1 font-figtree-medium text-sm">
                {user?.province}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-36 font-figtree-medium text-muted-foreground text-sm">
                Municipality
              </Text>
              <Text className="flex-1 font-figtree-medium text-sm">
                {user?.municipality}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-36 font-figtree-medium text-muted-foreground text-sm">
                Barangay
              </Text>
              <Text className="flex-1 font-figtree-medium text-sm">
                {user?.barangay}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-36 font-figtree-medium text-muted-foreground text-sm">
                Street Name
              </Text>
              <Text className="flex-1 font-figtree-medium text-sm">
                {user?.street_name}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-36 font-figtree-medium text-muted-foreground text-sm">
                Postal Code
              </Text>
              <Text className="flex-1 font-figtree-medium text-sm">
                {user?.postal_code}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Button>
        <Text className="font-figtree-medium">Next</Text>
      </Button>
    </ScrollView>
  );
}
