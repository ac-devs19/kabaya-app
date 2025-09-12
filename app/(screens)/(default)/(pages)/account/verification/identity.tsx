import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import {
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollView as SelectScrollView } from "react-native-gesture-handler";
import { suffixs } from "@/components/others";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import DatetimePicker from "@/components/datetime-picker";
import { Button } from "@/components/ui/button";
import { Mars, Venus } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Input from "@/components/input";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import axios from "@/api/axios";
import { router } from "expo-router";
import { useLoader } from "@/contexts/loader-context";

export default function Identity() {
  const { user, getUser } = useAuthContext();
  const [is_middle_name, setIsMiddleName] = useState(!user?.middle_name);
  const { setLoader } = useLoader();

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
      ? z.string().nullable()
      : z.string().min(1, "The middle name field is required."),
    last_name: z.string().min(1, "The last name field is required."),
    suffix: z.string(),
    birth_date: z.date(),
    phone_number: z
      .string()
      .min(10, "The phone number field must be 10 digits."),
    sex: z.string(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    resetField,
    setValue,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user?.first_name,
      middle_name: user?.middle_name ?? "",
      last_name: user?.last_name,
      suffix: user?.suffix ?? "N/A",
      birth_date: user?.birth_date ? new Date(user.birth_date) : new Date(),
      phone_number: user?.phone_number,
      sex: user?.sex ?? "MALE",
    },
  });

  const onCheckedChange = (value: boolean) => {
    setIsMiddleName(value);

    if (value) {
      setValue("middle_name", null as any);
      clearErrors("middle_name");
    } else {
      resetField("middle_name");
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoader(true);
    try {
      await axios.post("/update-identity", data);
      await getUser();
      router.push("/account/verification/address");
    } catch (error: any) {
      if (error.response.status === 422) {
        Alert.alert("Error!", error.response.data.message);
      }
    } finally {
      setLoader(false);
    }
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
          <View className="bg-muted flex-1 h-[6px] rounded-full" />
          <View className="bg-muted flex-1 h-[6px] rounded-full" />
        </View>
        <View className="gap-1">
          <Text className="font-figtree-bold text-2xl">
            Identity Verification
          </Text>
          <Text className="text-sm font-figtree-regular">
            Please enter your personal information.
          </Text>
        </View>
        <View className="gap-3">
          <Text className="font-figtree-semibold">Personal Information</Text>
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
                    <SelectContent insets={contentInsets} className="w-[140px]">
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
                  value={value ?? ""}
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
            name="birth_date"
            render={({ field: { onChange, value } }) => (
              <View className="gap-0.5">
                <Label className="font-figtree-medium">Birth Date</Label>
                <DatetimePicker date={value ?? undefined} setDate={onChange} />
              </View>
            )}
          />
          <Controller
            control={control}
            name="phone_number"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Phone Number"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.phone_number?.message}
                maxLength={10}
                keyboardType="phone-pad"
              />
            )}
          />
          <Controller
            control={control}
            name="sex"
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                className="flex-row gap-4"
                value={value}
                onValueChange={onChange}
              >
                <TouchableOpacity
                  onPress={() => setValue("sex", "MALE")}
                  activeOpacity={0.7}
                  className={cn(
                    "border flex-1 h-14 rounded-md flex-row items-center justify-between px-4",
                    value === "MALE" ? "border-primary" : "border-border"
                  )}
                >
                  <View className="flex-row items-center gap-2">
                    <Icon as={Mars} size={22} strokeWidth={1.5} />
                    <Text className="font-figtree-regular">MALE</Text>
                  </View>
                  <RadioGroupItem value="MALE" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setValue("sex", "FEMALE")}
                  activeOpacity={0.7}
                  className={cn(
                    "border flex-1 h-14 rounded-md flex-row items-center justify-between px-4",
                    value === "FEMALE" ? "border-primary" : "border-border"
                  )}
                >
                  <View className="flex-row items-center gap-2">
                    <Icon as={Venus} size={22} strokeWidth={1.5} />
                    <Text className="font-figtree-regular">FEMALE</Text>
                  </View>
                  <RadioGroupItem value="FEMALE" />
                </TouchableOpacity>
              </RadioGroup>
            )}
          />
        </View>
      </View>
      <Button onPress={handleSubmit(onSubmit)}>
        <Text className="font-figtree-medium">Next</Text>
      </Button>
    </ScrollView>
  );
}
