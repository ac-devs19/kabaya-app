import { createContext, useContext, ReactNode } from "react";
import { View } from "react-native";
import { BottomSheet, useBottomSheet } from "@/components/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { UserCheck } from "lucide-react-native";
import { router } from "expo-router";

interface VerifyContextType {
  open: () => void;
}

const VerifyContext = createContext<VerifyContextType | undefined>(undefined);

export const VerifyProvider = ({ children }: { children: ReactNode }) => {
  const { isVisible, open, close } = useBottomSheet();

  return (
    <VerifyContext.Provider value={{ open }}>
      {children}
      <BottomSheet isVisible={isVisible} onClose={close} snapPoints={[0.4]}>
        <View className="gap-20">
          <View className="items-center gap-6">
            <Icon
              as={UserCheck}
              size={35}
              strokeWidth={1.5}
              className="text-primary"
            />
            <View className="items-center gap-3">
              <Text className="font-figtree-bold text-xl">
                Verify Your Account
              </Text>
              <Text className="font-figtree-regular">
                Verify now to enjoy more features and services.
              </Text>
            </View>
          </View>
          <View className="gap-2">
            <Button
              onPress={() => {
                close();
                router.push("/account/verification/identity");
              }}
            >
              <Text className="font-figtree-medium">Verify Now</Text>
            </Button>
            <Button onPress={close} variant="ghost">
              <Text className="font-figtree-medium">I&apos;ll do it later</Text>
            </Button>
          </View>
        </View>
      </BottomSheet>
    </VerifyContext.Provider>
  );
};

export const useVerify = () => {
  const context = useContext(VerifyContext);
  if (!context) {
    throw new Error("useVerify must be used within a VerifyProvider");
  }
  return context;
};
