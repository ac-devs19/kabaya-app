import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, View, Pressable } from "react-native";
import { Input } from "@/components/ui/input";

type DatetimePickerProps = {
  date?: Date;
  setDate: (date?: Date) => void;
};

export default function DatetimePicker({ date, setDate }: DatetimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }

    if (Platform.OS === "android") {
      setShowPicker(false);
    }
  };

  return (
    <View className="gap-2">
      <Pressable onPress={() => setShowPicker(true)}>
        <Input
          value={date?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).toUpperCase()}
          placeholder="Select a date"
          readOnly
          className="font-figtree-regular"
        />
      </Pressable>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date ?? new Date()}
          mode="date"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
        />
      )}
    </View>
  );
}
