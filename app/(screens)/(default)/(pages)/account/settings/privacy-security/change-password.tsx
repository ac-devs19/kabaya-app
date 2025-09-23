import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/contexts/auth-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function ChangePassword() {
  const { changePassword } = useAuthContext();

  const formSchema = z
    .object({
      current_password: z
        .string()
        .min(1, "The current password field is required."),
      password: z
        .string()
        .min(8, "The new password field must be at least 8 characters."),
      password_confirmation: z
        .string()
        .min(8, "The confirm password field must be at least 8 characters."),
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
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    changePassword(data);
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
        <View className="gap-3">
          <Controller
            control={control}
            name="current_password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Current Password"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.current_password?.message}
                secureTextEntry
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="New Password"
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
        <Button onPress={handleSubmit(onSubmit)}>
          <Text className="font-figtree-medium">Save Changes</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
