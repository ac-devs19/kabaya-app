import {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";
import { Modal, View } from "react-native";
import LottieView from "lottie-react-native";

interface LoaderContextType {
  setLoader: Dispatch<SetStateAction<boolean>>;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [loader, setLoader] = useState(false);

  return (
    <LoaderContext.Provider value={{ setLoader }}>
      {children}
      <View>
        <Modal
          visible={loader}
          animationType="fade"
          statusBarTranslucent
          navigationBarTranslucent
          backdropColor="#00000005"
        >
          <View className="flex-1 items-center justify-center">
            <LottieView
              style={{
                width: 150,
                height: 150,
              }}
              source={require("@/assets/animations/liquid-4-dot-loader.json")}
              autoPlay
              loop
            />
          </View>
        </Modal>
      </View>
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};
