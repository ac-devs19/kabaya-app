import { Image, TextInputProps, View } from "react-native";
import { Label } from "@/components/ui/label";
import { Input as Inpt } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Eye, EyeOff } from "lucide-react-native";
import { useAppColors } from "@/lib/theme";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerClassName?: ClassNameValue;
  inputClassName?: ClassNameValue;
  disabled?: boolean;
  secureTextEntry?: boolean;
}

export default function Input({
  label,
  error,
  containerClassName,
  inputClassName,
  disabled,
  secureTextEntry,
  keyboardType,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { primary } = useAppColors();

  return (
    <View className={cn("gap-0.5", containerClassName)}>
      <Label
        className={cn("font-figtree-medium", error && "text-destructive")}
        disabled={disabled}
      >
        {label}
      </Label>
      <View className="relative">
        <Inpt
          className={cn(
            "font-figtree-regular focus:border-primary",
            error && "border-destructive",
            secureTextEntry && "pr-12",
            keyboardType === "phone-pad" && "pl-[73px]",
            inputClassName
          )}
          editable={!disabled}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          selectionColor={primary}
          {...props}
        />
        {secureTextEntry && (
          <View className="absolute inset-y-0 right-0.5 justify-center">
            <Button
              onPress={() => setShowPassword(!showPassword)}
              variant="ghost"
              size="icon"
              className="size-9"
            >
              <Icon
                as={showPassword ? Eye : EyeOff}
                size={22}
                strokeWidth={1.5}
                className="text-muted-foreground"
              />
            </Button>
          </View>
        )}
        {keyboardType === "phone-pad" && (
          <View className="absolute inset-y-0 left-1.5 flex-row items-center">
            <Image
              resizeMode="contain"
              source={require("@/assets/images/flag.png")}
              className="size-10"
            />
            <Text className="font-figtree-regular">+63</Text>
          </View>
        )}
      </View>
      {error && (
        <Text className="text-destructive font-figtree-regular text-xs">
          {error}
        </Text>
      )}
    </View>
  );
}
