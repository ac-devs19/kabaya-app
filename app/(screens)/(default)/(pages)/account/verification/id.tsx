import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Camera, Circle, RotateCcw, X } from "lucide-react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { useToast } from "@/components/toast";
import axios from "@/api/axios";
import { router } from "expo-router";
import { useLoader } from "@/contexts/loader-context";
import { useAuthContext } from "@/contexts/auth-context";

export default function Id() {
  const { getUser } = useAuthContext();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [selfieIdPhoto, setSelfieIdPhoto] = useState<string | null>(null);
  const [mode, setMode] = useState<"id" | "selfie">("id");
  const { error } = useToast();
  const { setLoader } = useLoader();

  const openCamera = async (captureMode: "id" | "selfie") => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setMode(captureMode);
    setOpen(true);
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    setLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: true,
      });

      if (mode === "id") {
        // overlay size (dp)
        const overlayWidth = 300;
        const overlayHeight = 190;

        // screen size (dp)
        const screenWidth = Dimensions.get("window").width;
        const screenHeight = Dimensions.get("window").height;

        // photo size (px)
        const photoWidth = photo.width;
        const photoHeight = photo.height;

        // aspect ratios
        const screenRatio = screenHeight / screenWidth;
        const photoRatio = photoHeight / photoWidth;

        let cropRegion;

        if (photoRatio > screenRatio) {
          // photo is "taller" than screen → camera cropped vertically
          const scale = photoWidth / screenWidth;
          const scaledHeight = screenHeight * scale;
          const verticalOffset = (photoHeight - scaledHeight) / 2;

          cropRegion = {
            originX: ((screenWidth - overlayWidth) / 2) * scale,
            originY:
              ((screenHeight - overlayHeight) / 2) * scale + verticalOffset,
            width: overlayWidth * scale,
            height: overlayHeight * scale,
          };
        } else {
          // photo is "wider" than screen → camera cropped horizontally
          const scale = photoHeight / screenHeight;
          const scaledWidth = screenWidth * scale;
          const horizontalOffset = (photoWidth - scaledWidth) / 2;

          cropRegion = {
            originX:
              ((screenWidth - overlayWidth) / 2) * scale + horizontalOffset,
            originY: ((screenHeight - overlayHeight) / 2) * scale,
            width: overlayWidth * scale,
            height: overlayHeight * scale,
          };
        }

        // crop
        const cropped = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ crop: cropRegion }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        setIdPhoto(cropped.uri);
      } else {
        // selfie (no crop, just save directly)
        setSelfieIdPhoto(photo.uri);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleSubmit = async () => {
    if (!idPhoto || !selfieIdPhoto) {
      error(
        "Error!",
        "Please upload your ID and Selfie with ID before submitting."
      );
    } else {
      setLoader(true);
      try {
        const formData = new FormData();

        formData.append("idPhoto", {
          uri: idPhoto,
          type: "image/jpeg",
          name: "idPhoto.jpg",
        } as any);

        formData.append("selfieIdPhoto", {
          uri: selfieIdPhoto,
          type: "image/jpeg",
          name: "selfiePhoto.jpg",
        } as any);

        await axios.post("/submit-id", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        await getUser();
        router.dismissAll();
        router.replace("/home");
      } catch (error: any) {
        if (error.response.status === 422) {
          Alert.alert("Error!", error.response.data.message);
        }
      } finally {
        setLoader(false);
      }
    }
  };

  return (
    <React.Fragment>
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
            <View className="bg-primary flex-1 h-[6px] rounded-full" />
          </View>
          <View className="gap-1">
            <Text className="font-figtree-bold text-2xl">Upload Your ID</Text>
            <Text className="text-sm font-figtree-regular">
              Please ensure that you are the one verifying your identity.
            </Text>
          </View>
          <View className="gap-3">
            <View className="gap-0.5">
              <Label className="font-figtree-medium">1. ID</Label>
              <View className="relative w-full h-[190px] items-center bg-muted rounded-md overflow-hidden">
                {idPhoto ? (
                  <View className="relative w-full h-[190px]">
                    <Image
                      source={{ uri: idPhoto }}
                      resizeMode="contain"
                      className="size-full"
                    />
                    <View className="absolute top-1 right-1">
                      <Button
                        size="icon"
                        onPress={() => openCamera("id")}
                        variant="ghost"
                        className="rounded-full"
                      >
                        <Icon
                          as={RotateCcw}
                          size={22}
                          strokeWidth={1.5}
                          className="text-primary"
                        />
                      </Button>
                    </View>
                  </View>
                ) : (
                  <View className="absolute inset-0 items-center justify-center">
                    <Button onPress={() => openCamera("id")}>
                      <Icon
                        as={Camera}
                        size={22}
                        strokeWidth={1.5}
                        color="#fff"
                      />
                      <Text className="font-figtree-medium">Take a Photo</Text>
                    </Button>
                  </View>
                )}
              </View>
              <Text className="font-figtree-regular text-sm">
                Note: Please take a clear photo of your ID. Make sure all
                details are visible and that you are the one verifying.
              </Text>
            </View>
            <View className="gap-0.5">
              <Label className="font-figtree-medium">2. Selfie with ID</Label>
              <View className="relative w-full h-[300px] items-center bg-muted rounded-md overflow-hidden">
                {selfieIdPhoto ? (
                  <View className="relative w-full h-[300px]">
                    <Image
                      source={{ uri: selfieIdPhoto }}
                      resizeMode="contain"
                      className="size-full"
                    />
                    <View className="absolute top-1 right-1">
                      <Button
                        size="icon"
                        onPress={() => openCamera("selfie")}
                        variant="ghost"
                        className="rounded-full"
                      >
                        <Icon
                          as={RotateCcw}
                          size={22}
                          strokeWidth={1.5}
                          className="text-primary"
                        />
                      </Button>
                    </View>
                  </View>
                ) : (
                  <View className="absolute inset-0 items-center justify-center">
                    <Button onPress={() => openCamera("selfie")}>
                      <Icon
                        as={Camera}
                        size={22}
                        strokeWidth={1.5}
                        color="#fff"
                      />
                      <Text className="font-figtree-medium">Take a Photo</Text>
                    </Button>
                  </View>
                )}
              </View>
              <Text className="font-figtree-regular text-sm">
                Note: Hold your ID next to your face when taking the selfie.
                Ensure both your face and the ID are clearly visible.
              </Text>
            </View>
          </View>
        </View>
        <Button onPress={handleSubmit}>
          <Text className="font-figtree-medium">Submit</Text>
        </Button>
      </ScrollView>

      <Modal
        visible={open}
        transparent
        statusBarTranslucent
        navigationBarTranslucent
        animationType="fade"
      >
        <View className="relative flex-1 bg-black">
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing={mode === "selfie" ? "front" : "back"}
          />

          {/* Overlay mask with transparent ID frame */}
          {mode === "id" && (
            <View className="absolute inset-0 items-center justify-center">
              <View className="absolute w-[300px] h-[190px] border border-primary rounded-md" />
            </View>
          )}

          {/* Buttons */}
          <View className="w-full absolute bottom-20 flex-row items-center justify-between px-10">
            <View className="size-10" />
            <Button
              size="icon"
              onPress={takePhoto}
              className="rounded-full size-16"
              disabled={loading}
            >
              <Icon as={Circle} size={40} strokeWidth={1.5} color="#fff" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onPress={() => setOpen(false)}
              className="rounded-full"
              disabled={loading}
            >
              <Icon
                as={X}
                size={22}
                strokeWidth={1.5}
                className="text-primary"
              />
            </Button>
          </View>
        </View>
      </Modal>
    </React.Fragment>
  );
}
