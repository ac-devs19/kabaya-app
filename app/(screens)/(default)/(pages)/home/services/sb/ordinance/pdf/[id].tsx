import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import { useQuery } from "@tanstack/react-query";
import axios from "@/api/axios";
import { useLoader } from "@/contexts/loader-context";
import { useEffect } from "react";

interface OrdinancePdf {
  previewLink: string;
}

export default function PdfReader() {
  const { id } = useLocalSearchParams();
  const { setLoader } = useLoader();

  const previewOrdinancePdf = async () => {
    try {
      const { data } = await axios.get(
        `/services/sb/ordinance/preview-pdf/${id}`
      );
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
  };

  const { data, isLoading } = useQuery<OrdinancePdf>({
    queryKey: ["preview_ordinance_pdf", id],
    queryFn: previewOrdinancePdf,
  });

  useEffect(() => {
    setLoader(isLoading);
  }, [isLoading, setLoader]);

  return data ? (
    <WebView
      source={{
        uri: data.previewLink,
      }}
    />
  ) : null;
}
