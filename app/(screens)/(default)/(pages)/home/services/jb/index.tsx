import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ChevronRight, Hospital } from "lucide-react-native";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function SerbisyongBago() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
      }}
    >
      <View className="gap-4">
        <TouchableOpacity
          activeOpacity={0.7}
          className="bg-card p-4 flex-row justify-between items-center rounded-md border border-border"
        >
          <View className="flex-row items-center gap-4">
            <Icon as={Hospital} size={22} strokeWidth={1.5} />
            <Text className="font-figtree-medium">Hospital Billing</Text>
          </View>
          <Icon
            as={ChevronRight}
            size={22}
            strokeWidth={1.5}
            className="text-primary"
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
