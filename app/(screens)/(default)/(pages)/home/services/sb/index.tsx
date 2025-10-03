import axios from "@/api/axios";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useLoader } from "@/contexts/loader-context";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ChevronRight, Folder } from "lucide-react-native";
import { useEffect } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

interface OrdinanceFolder {
  id: string;
  name: string;
}

export default function SangguniangBayan() {
  const { setLoader } = useLoader();

  const getOrdinanceFolder = async () => {
    try {
      const { data } = await axios.get("/services/sb/ordinance/get-folder");
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
  };

  const { data, isLoading } = useQuery<OrdinanceFolder[]>({
    queryKey: ["get_ordinance_folder"],
    queryFn: getOrdinanceFolder,
    select: (data) => {
      return [...data].sort((a, b) => {
        const aYear = parseInt(a.name.match(/\d{4}$/)?.[0] || "0");
        const bYear = parseInt(b.name.match(/\d{4}$/)?.[0] || "0");

        const aType = a.name.replace(/\d{4}$/, "").trim();
        const bType = b.name.replace(/\d{4}$/, "").trim();

        if (aType !== bType) {
          return aType.localeCompare(bType);
        }

        return bYear - aYear;
      });
    },
  });

  useEffect(() => {
    setLoader(isLoading);
  }, [isLoading, setLoader]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
      }}
    >
      <View className="gap-4">
        {data?.map((folder, index) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/home/services/sb/ordinance/[id]",
                params: { id: folder.id, name: folder.name },
              });
            }}
            key={index}
            activeOpacity={0.7}
            className="h-16 bg-card px-4 flex-row justify-between items-center rounded-md border border-border gap-4"
          >
            <View className="flex-row items-center gap-4 flex-1">
              <Icon as={Folder} size={22} strokeWidth={1.5} />
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className="flex-1 font-figtree-medium"
              >
                {folder.name}
              </Text>
            </View>

            <Icon
              as={ChevronRight}
              size={22}
              strokeWidth={1.5}
              className="text-primary"
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
