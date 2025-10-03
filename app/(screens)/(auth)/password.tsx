import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/contexts/auth-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function Password() {
  const { createPassword, resetPassword, email, isForgotPassword } =
    useAuthContext();

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, "The password field must be at least 8 characters."),
      password_confirmation: z
        .string()
        .min(8, "The confirm password field must be at least 8 characters."),
      email: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "The password confirmation do not match.",
      path: ["password_confirmation"],
    });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
      email: email,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (isForgotPassword) {
      resetPassword(data);
    } else {
      createPassword(data);
    }
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
            <View className="bg-primary flex-1 h-1.5 rounded-full" />
            <View className="bg-primary flex-1 h-1.5 rounded-full" />
            <View className="bg-primary flex-1 h-1.5 rounded-full" />
          </View>
          <View className="gap-1">
            <Text className="font-figtree-bold text-2xl">
              {isForgotPassword ? "Reset Password" : "Create Password"}
            </Text>
            <Text className="text-sm font-figtree-regular">
              Please setup your password.
            </Text>
          </View>
          <View className="gap-3">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.password?.message}
                  secureTextEntry
                />
              )}
            />
            <Controller
              control={control}
              name="password_confirmation"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm Password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.password_confirmation?.message}
                  secureTextEntry
                />
              )}
            />
          </View>
        </View>
        <Button onPress={handleSubmit(onSubmit)}>
          <Text className="font-figtree-medium">Finish</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
