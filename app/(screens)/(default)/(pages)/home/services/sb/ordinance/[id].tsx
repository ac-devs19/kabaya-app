import axios from "@/api/axios";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useLoader } from "@/contexts/loader-context";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronRight, File } from "lucide-react-native";
import { useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";

interface OrdinancePdf {
  id: string;
  name: string;
}

export default function Ordinance() {
  const { id } = useLocalSearchParams();
  const { setLoader } = useLoader();

  const getOrdinancePdf = async () => {
    try {
      const { data } = await axios.get(`/services/sb/ordinance/get-pdf/${id}`);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
  };

  const { data, isLoading } = useQuery<OrdinancePdf[]>({
    queryKey: ["get_ordinance_pdf", id],
    queryFn: getOrdinancePdf,
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
        {data?.map((pdf, index) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/home/services/sb/ordinance/pdf/[id]",
                params: { id: pdf.id, name: pdf.name },
              });
            }}
            key={index}
            activeOpacity={0.7}
            className="h-16 bg-card px-4 flex-row justify-between items-center rounded-md border border-border gap-4"
          >
            <View className="flex-row items-center gap-4 flex-1">
              <Icon as={File} size={22} strokeWidth={1.5} />
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className="flex-1 font-figtree-medium"
              >
                {pdf.name}
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
