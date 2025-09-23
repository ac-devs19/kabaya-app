import { Label } from "@/components/ui/label";
import { View, Platform } from "react-native";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { ScrollView as SelectScrollView } from "react-native-gesture-handler";
import { suffixs } from "@/components/others";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { router } from "expo-router";
import AppLogo from "@/components/app-logo";
import { useAuthContext } from "@/contexts/auth-context";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function SignUp() {
  const { createAccount } = useAuthContext();
  const [is_middle_name, setIsMiddleName] = useState(false);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      ios: insets.bottom,
      android: insets.bottom + 24,
    }),
    left: 12,
    right: 12,
  };

  const formSchema = z.object({
    first_name: z.string().min(1, "The first name field is required."),
    middle_name: is_middle_name
      ? z.string().optional()
      : z.string().min(1, "The middle name field is required."),
    last_name: z.string().min(1, "The last name field is required."),
    suffix: z.string(),
    email: z.email("The email field must be a valid email address."),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    resetField,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      suffix: "N/A",
      email: "",
    },
  });

  const onCheckedChange = (value: boolean) => {
    setIsMiddleName(value);
    resetField("middle_name");
    clearErrors("middle_name");
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createAccount(data);
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
          <AppLogo />
          <Text className="font-figtree-bold text-2xl">
            Let&apos;s Get Started!
          </Text>
          <View className="gap-3">
            <View className="flex-row gap-2">
              <Controller
                control={control}
                name="first_name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="First Name"
                    onChangeText={(text) => onChange(text.toUpperCase())}
                    onBlur={onBlur}
                    value={value}
                    error={errors.first_name?.message}
                    containerClassName="flex-1"
                  />
                )}
              />
              <Controller
                control={control}
                name="suffix"
                render={({ field: { onChange, value } }) => (
                  <View className="gap-0.5">
                    <Label className="font-figtree-medium">Suffix</Label>
                    <Select
                      value={value ? { label: value, value } : undefined}
                      onValueChange={(option) => onChange(option?.value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue
                          placeholder="Select"
                          className="font-figtree-regular"
                        />
                      </SelectTrigger>
                      <SelectContent
                        insets={contentInsets}
                        className="w-[140px]"
                      >
                        <SelectScrollView className="max-h-52">
                          <SelectGroup>
                            {suffixs.map((suffix) => (
                              <SelectItem
                                key={suffix}
                                label={suffix}
                                value={suffix}
                              />
                            ))}
                          </SelectGroup>
                        </SelectScrollView>
                      </SelectContent>
                    </Select>
                  </View>
                )}
              />
            </View>
            <View className="gap-1.5">
              <Controller
                control={control}
                name="middle_name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Middle Name"
                    onChangeText={(text) => onChange(text.toUpperCase())}
                    onBlur={onBlur}
                    value={value}
                    error={errors.middle_name?.message}
                    disabled={is_middle_name}
                  />
                )}
              />
              <View className="flex-row items-center justify-end gap-2">
                <Checkbox
                  checked={is_middle_name}
                  onCheckedChange={onCheckedChange}
                />
                <Label
                  onPress={() => onCheckedChange(!is_middle_name)}
                  className="font-figtree-medium"
                >
                  I have no middle name
                </Label>
              </View>
            </View>
            <Controller
              control={control}
              name="last_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Last Name"
                  onChangeText={(text) => onChange(text.toUpperCase())}
                  onBlur={onBlur}
                  value={value}
                  error={errors.last_name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email Address"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  onChangeText={(text) => onChange(text.toUpperCase())}
                  onBlur={onBlur}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />
            <Text className="text-sm text-center font-figtree-regular">
              By tapping{" "}
              <Text className="text-sm font-figtree-medium">
                Create new account
              </Text>
              , you agree with the
              {"\n"}
              <Text className="text-sm font-figtree-medium text-primary">
                Terms and Conditions
              </Text>{" "}
              and{" "}
              <Text className="text-sm font-figtree-medium text-primary">
                Privacy Notice
              </Text>
            </Text>
          </View>
        </View>
        <View className="gap-3">
          <Button onPress={handleSubmit(onSubmit)}>
            <Text className="font-figtree-medium">Create new account</Text>
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
              Already have an Kabaya account?
            </Text>
            <Button onPress={() => router.push("/sign-in")} variant="outline">
              <Text className="font-figtree-medium">Login here</Text>
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
