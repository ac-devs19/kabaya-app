import { useColorScheme } from "nativewind";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Moon, Sun } from "lucide-react-native";

export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPress={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="rounded-full"
    >
      <Icon
        as={colorScheme === "dark" ? Moon : Sun}
        size={22}
        strokeWidth={1.5}
      />
    </Button>
  );
}
