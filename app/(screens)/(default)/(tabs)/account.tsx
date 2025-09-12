import { BottomSheet, useBottomSheet } from "@/components/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import User from "@/components/user";
import { useAuthContext } from "@/contexts/auth-context";
import { router } from "expo-router";
import { ChevronRight, LogOut, Settings } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function Account() {
  const { logout } = useAuthContext();
  const { isVisible, open, close } = useBottomSheet();

  return (
    <React.Fragment>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
        }}
      >
        <View className="gap-4">
          <View className="p-4">
            <User />
          </View>
          <View className="gap-2">
            <TouchableOpacity
              onPress={() => router.push("/account/settings")}
              activeOpacity={0.7}
              className="flex-row items-center justify-between px-4 py-2"
            >
              <View className="flex-row items-center gap-4">
                <Icon as={Settings} size={22} strokeWidth={1.5} />
                <Text className="font-figtree-medium text-sm">Settings</Text>
              </View>
              <Icon
                as={ChevronRight}
                size={22}
                strokeWidth={1.5}
                className="text-primary"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={open}
              activeOpacity={0.7}
              className="flex-row items-center justify-between px-4 py-2"
            >
              <View className="flex-row items-center gap-4">
                <Icon as={LogOut} size={24} strokeWidth={1.5} />
                <Text className="font-figtree-medium">Logout</Text>
              </View>
              <Icon
                as={ChevronRight}
                size={22}
                strokeWidth={1.5}
                className="text-primary"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <BottomSheet isVisible={isVisible} onClose={close} snapPoints={[0.4]}>
        <View className="gap-20">
          <View className="items-center gap-6">
            <Icon
              as={LogOut}
              size={35}
              strokeWidth={1.5}
              className="text-destructive"
            />
            <View className="items-center gap-3">
              <Text className="font-figtree-bold text-xl">Log Out</Text>
              <Text className="font-figtree-regular">
                Are you sure you want to logout?
              </Text>
            </View>
          </View>
          <View className="gap-2">
            <Button
              onPress={() => {
                close();
                logout();
              }}
              variant="destructive"
            >
              <Text className="font-figtree-medium">Yes</Text>
            </Button>
            <Button onPress={close} variant="ghost">
              <Text className="font-figtree-medium">Cancel</Text>
            </Button>
          </View>
        </View>
      </BottomSheet>
    </React.Fragment>
  );
}
