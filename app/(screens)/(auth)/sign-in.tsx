import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AppLogo from "@/components/app-logo";
import Input from "@/components/input";
import { useAuthContext } from "@/contexts/auth-context";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function SignIn() {
  const { login } = useAuthContext();

  const formSchema = z.object({
    email: z.email("The email field must be a valid email address."),
    password: z.string().min(1, "The password field is required."),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    login(data);
  };

  return (
    <SafeAreaView className="flex-1">
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
            <AppLogo />
            <View className="gap-1">
              <Text className="font-figtree-bold text-2xl">
                Hello, Welcome!
              </Text>
              <Text className="text-sm font-figtree-regular">
                Please login your account.
              </Text>
            </View>
            <View className="gap-3">
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
              <View className="items-center">
                <Button
                  onPress={() => router.push("/forgot-password")}
                  variant="link"
                >
                  <Text className="font-figtree-medium">Forgot Password?</Text>
                </Button>
              </View>
            </View>
          </View>
          <View className="gap-3">
            <Button onPress={handleSubmit(onSubmit)}>
              <Text className="font-figtree-medium">Login</Text>
            </Button>
            <View className="flex-row justify-between items-center gap-4">
              <View className="flex-1">
                <Separator />
              </View>
              <Text className="text-sm font-figtree-regular">or</Text>
              <View className="flex-1">
                <Separator />
              </View>
            </View>
            <View className="gap-1">
              <Text className="text-sm text-center font-figtree-regular text-muted-foreground">
                Don&apos;t have an Kabaya account yet?
              </Text>
              <Button onPress={() => router.push("/sign-up")} variant="outline">
                <Text className="font-figtree-medium">Create an account</Text>
              </Button>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
