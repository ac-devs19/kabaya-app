import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react-native";
import { useAuthContext } from "@/contexts/auth-context";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/input";

export default function OtpVerification() {
  const { email, verifyOtp, resendOtp } = useAuthContext();

  const formSchema = z.object({
    otp: z.string().min(1, "The otp field is required."),
    email: z.string(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email: email,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    verifyOtp(data);
  };

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
          <View className="bg-muted flex-1 h-[6px] rounded-full" />
        </View>
        <View className="gap-1">
          <Text className="font-figtree-bold text-2xl">Email Verification</Text>
          <Text className="text-sm font-figtree-regular">
            Please enter the one-time password (OTP) that we sent to{" "}
            <Text className="text-sm font-figtree-medium">{email}</Text>{" "}
            containing a 6-digit code.
          </Text>
        </View>
        <View className="gap-3">
          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="OTP"
                keyboardType="numeric"
                onChangeText={(text) => {
                  onChange(text);
                  if (text.length === 6) {
                    handleSubmit(onSubmit)();
                  }
                }}
                onBlur={onBlur}
                value={value}
                error={errors.otp?.message}
                maxLength={6}
              />
            )}
          />
          <View className="items-center">
            <Button onPress={resendOtp} variant="link">
              <Text className="font-figtree-medium">Resend code</Text>
            </Button>
          </View>
        </View>
        <Alert icon={Info}>
          <AlertTitle className="font-figtree-medium">Note</AlertTitle>
          <AlertDescription className="text-sm font-figtree-regular">
            Kindly wait for at least 3 minutes for the 6-digit code to arrive.
            Sometimes, there may be delays in receiving it. Thank you for your
            patience!
          </AlertDescription>
        </Alert>
        <Text className="text-sm text-center font-figtree-regular">
          Didn&apos;t receive the email?
          {"\n"}
          Try checking your junk or spam folders.
        </Text>
      </View>
      <View className="gap-1">
        <Text className="text-sm text-center font-figtree-regular text-muted-foreground">
          Not <Text className="text-sm font-figtree-medium">{email}</Text>?
        </Text>
        <View className="items-center">
          <Button variant="link">
            <Text className="font-figtree-medium">Edit email here</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
