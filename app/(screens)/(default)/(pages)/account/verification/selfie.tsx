import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";

export default function Selfie() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
        gap: 40,
        justifyContent: "space-between",
      }}
    >
      <View className="gap-6">
        <View className="flex-row items-center justify-between gap-2">
          <View className="bg-primary flex-1 h-[6px] rounded-full" />
          <View className="bg-primary flex-1 h-[6px] rounded-full" />
          <View className="bg-primary flex-1 h-[6px] rounded-full" />
        </View>
        <View className="gap-1">
          <Text className="font-figtree-bold text-2xl">Take Live Selfie</Text>
          <Text className="text-sm font-figtree-regular">
            Make sure you are the person verifying.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
