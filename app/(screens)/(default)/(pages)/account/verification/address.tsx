import Input from "@/components/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Alert, Platform, View } from "react-native";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollView as SelectScrollView } from "react-native-gesture-handler";
import { address } from "@/components/others";
import { Button } from "@/components/ui/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { useLoader } from "@/contexts/loader-context";
import axios from "@/api/axios";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function Address() {
  const { user, getUser } = useAuthContext();
  const { setLoader } = useLoader();

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      ios: insets.bottom,
      android: insets.bottom + 24,
    }),
    left: 16,
    right: 16,
  };

  const formSchema = z.object({
    province: z.string(),
    municipality: z.string(),
    barangay: z.string().min(1, "The barangay field is required."),
    street_name: z.string().min(1, "The street name field is required."),
    postal_code: z.string(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      province: user?.province ?? address.province,
      municipality: user?.municipality ?? address.municipality,
      barangay: user?.barangay ?? "",
      street_name: user?.street_name ?? "",
      postal_code: user?.postal_code ?? address.zip_code,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoader(true);
    try {
      await axios.post("/update-address", data);
      await getUser();
      router.push("/account/verification/confirm-information");
    } catch (error: any) {
      if (error.response.status === 422) {
        Alert.alert("Error!", error.response.data.message);
      }
    } finally {
      setLoader(false);
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
            <View className="bg-primary flex-1 h-[6px] rounded-full" />
            <View className="bg-primary flex-1 h-[6px] rounded-full" />
            <View className="bg-muted flex-1 h-[6px] rounded-full" />
          </View>
          <View className="gap-1">
            <Text className="font-figtree-bold text-2xl">Current Address</Text>
            <Text className="text-sm font-figtree-regular">
              Please input the correct address below.
            </Text>
          </View>
          <View className="gap-3">
            <Text className="font-figtree-semibold">
              Input your complete current address
            </Text>
            <Controller
              control={control}
              name="province"
              render={({ field: { value } }) => (
                <Input
                  label="Province"
                  value={value}
                  error={errors.province?.message}
                  readOnly
                />
              )}
            />
            <Controller
              control={control}
              name="municipality"
              render={({ field: { value } }) => (
                <Input
                  label="Municipality"
                  value={value}
                  error={errors.municipality?.message}
                  readOnly
                />
              )}
            />
            <Controller
              control={control}
              name="barangay"
              render={({ field: { onChange, value } }) => (
                <View className="gap-0.5">
                  <Label
                    className={cn(
                      "font-figtree-medium",
                      errors.barangay && "text-destructive"
                    )}
                  >
                    Barangay
                  </Label>
                  <Select
                    value={value ? { label: value, value } : undefined}
                    onValueChange={(option) => onChange(option?.value)}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full",
                        errors.barangay && "border-destructive"
                      )}
                    >
                      <SelectValue
                        placeholder="Select"
                        className="font-figtree-regular"
                      />
                    </SelectTrigger>
                    <SelectContent insets={contentInsets} className="w-full">
                      <SelectScrollView className="max-h-52">
                        <SelectGroup>
                          {address.barangays.map((barangay) => (
                            <SelectItem
                              key={barangay.code}
                              label={barangay.name}
                              value={barangay.name}
                            />
                          ))}
                        </SelectGroup>
                      </SelectScrollView>
                    </SelectContent>
                  </Select>
                  {errors.barangay && (
                    <Text className="text-destructive font-figtree-regular text-xs">
                      {errors.barangay.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name="street_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Street Name"
                  onChangeText={(text) => onChange(text.toUpperCase())}
                  onBlur={onBlur}
                  value={value}
                  error={errors.street_name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="postal_code"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Postal Code"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.postal_code?.message}
                  readOnly
                />
              )}
            />
          </View>
        </View>
        <Button onPress={handleSubmit(onSubmit)}>
          <Text className="font-figtree-medium">Next</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
