import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAuthContext } from "@/contexts/auth-context";
import { useVerify } from "@/contexts/verify-context";
import { Route, router } from "expo-router";
import {
  ChevronRight,
  LockKeyhole,
  LucideIcon,
  UserCircle,
} from "lucide-react-native";
import { View, ScrollView, TouchableOpacity } from "react-native";

export default function Setting() {
  const { user } = useAuthContext();
  const { open } = useVerify();

  const items: {
    title: string;
    subitems: {
      subtitle: string;
      subdescription?: string;
      href: Route;
      icon: LucideIcon;
      is_verified?: boolean;
    }[];
  }[] = [
    {
      title: "Privacy & Security",
      subitems: [
        {
          subtitle: "Personal Information",
          href: "/account/settings/privacy-security/personal-information",
          icon: UserCircle,
          is_verified: user?.is_verified,
        },
        {
          subtitle: "Change Password",
          href: "/account/settings/privacy-security/change-password",
          icon: LockKeyhole,
        },
      ],
    },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 20,
      }}
    >
      {items.map((item, itemIndex) => (
        <View key={itemIndex}>
          <Text className="p-4 font-figtree-regular text-sm text-muted-foreground">
            {item.title}
          </Text>
          <View className="gap-2">
            {item.subitems.map((subitem, subitemIndex) => (
              <TouchableOpacity
                key={subitemIndex}
                onPress={() => {
                  if (typeof subitem.is_verified !== "undefined") {
                    if (!subitem.is_verified) {
                      open();
                    } else {
                      router.push(subitem.href);
                    }
                  } else {
                    router.push(subitem.href);
                  }
                }}
                activeOpacity={0.7}
                className="flex-row items-center justify-between px-4 py-2"
              >
                <View className="flex-row items-center gap-4">
                  <Icon as={subitem.icon} size={22} strokeWidth={1.5} />
                  <Text className="font-figtree-medium text-sm">
                    {subitem.subtitle}
                  </Text>
                </View>
                <Icon
                  as={ChevronRight}
                  size={22}
                  strokeWidth={1.5}
                  className="text-primary"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
