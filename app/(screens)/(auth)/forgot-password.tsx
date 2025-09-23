import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/contexts/auth-context";
import Input from "@/components/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function ForgotPassword() {
  const { forgotPassword } = useAuthContext();

  const formSchema = z.object({
    email: z.email("The email field must be a valid email address."),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    forgotPassword(data);
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
      }}
    >
      <View className="flex-1 justify-between gap-10">
        <View className="gap-6">
          <View className="flex-row items-center justify-between gap-2">
            <View className="bg-primary flex-1 h-[6px] rounded-full" />
            <View className="bg-muted flex-1 h-[6px] rounded-full" />
            <View className="bg-muted flex-1 h-[6px] rounded-full" />
          </View>
          <View className="gap-1">
            <Text className="font-figtree-bold text-2xl">Forgot Password</Text>
            <Text className="text-sm font-figtree-regular">
              Please enter your email address, and we&apos;ll send you a
              one-time password (OTP) for verification.
            </Text>
          </View>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.email?.message}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
              />
            )}
          />
        </View>
        <Button onPress={handleSubmit(onSubmit)}>
          <Text className="font-figtree-medium">Send</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
