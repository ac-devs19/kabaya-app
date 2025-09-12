import { Text } from "@/components/ui/text";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChevronsDownUp, ChevronsUpDown, UserCheck } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Route, router } from "expo-router";
import { Icon } from "@/components/ui/icon";
import User from "@/components/user";
import AppLogo from "@/components/app-logo";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/theme-toggle";
import { useAuthContext } from "@/contexts/auth-context";
import { useVerify } from "@/contexts/verify-context";

const screenWidth = Dimensions.get("window").width;

export default function Home() {
  const { user } = useAuthContext();
  const [minimize, setMinimize] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { open } = useVerify();

  const items: {
    title: string;
    icon: any;
    href: Route;
    new?: boolean;
    is_verified?: boolean;
  }[] = [
    {
      title: "Sangguniang Bayan",
      icon: require("@/assets/images/services/sb.png"),
      href: "/",
      new: true,
      is_verified: user?.is_verified,
    },
    {
      title: "Coming Soon",
      icon: null,
      href: "/",
    },
    {
      title: "Coming Soon",
      icon: null,
      href: "/",
    },
    {
      title: "Coming Soon",
      icon: null,
      href: "/",
    },
    {
      title: "Coming Soon",
      icon: null,
      href: "/",
    },
    {
      title: "Coming Soon",
      icon: null,
      href: "/",
    },
    {
      title: "Coming Soon",
      icon: null,
      href: "/",
    },
    {
      title: "Coming Soon",
      icon: null,
      href: "/",
    },
    {
      title: "Coming Soon",
      icon: null,
      href: "/",
    },
    {
      title: "Coming Soon",
      icon: null,
      href: "/",
    },
    {
      title: "Coming Soon",
      icon: null,
      href: "/",
    },
    {
      title: "Coming Soon",
      icon: null,
      href: "/",
    },
  ];

  const visibleItems = expanded ? items : items.slice(0, 7);

  return (
    <React.Fragment>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 25,
          paddingBottom: 140,
        }}
      >
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <AppLogo />
            <ThemeToggle />
          </View>
          <View className="flex-row items-center justify-between gap-4">
            <User />
            <Image
              resizeMode="contain"
              source={require("@/assets/images/background-styles/wonderful-opol.png")}
              className="size-[120px]"
            />
          </View>
        </View>
        <Image
          resizeMode="contain"
          source={require("@/assets/images/banner.png")}
          style={{
            width: screenWidth,
            height: undefined,
            aspectRatio: 1280 / 486,
          }}
        />
        <View className="p-3 flex-row flex-wrap">
          {visibleItems.map((item, index) => (
            <View key={index} className="basis-1/4 items-center p-1">
              <Button
                onPress={() => {
                  if (typeof item.is_verified !== "undefined") {
                    if (!item.is_verified) {
                      open();
                    } else {
                      router.push(item.href);
                    }
                  }
                }}
                variant="secondary"
                size="icon"
                className="size-[65px] rounded-full"
              >
                <Image
                  resizeMode="contain"
                  source={item.icon}
                  className="size-full"
                />
              </Button>
              <Text className="text-center font-figtree-medium text-xs">
                {item.title}
              </Text>
              {item.new && (
                <Badge
                  variant="destructive"
                  className="absolute right-0 p-0 px-1 rounded"
                >
                  <Text className="font-figtree-semibold">New</Text>
                </Badge>
              )}
            </View>
          ))}

          {items.length > 7 && (
            <View className="basis-1/4 items-center p-1">
              <Button
                variant="secondary"
                size="icon"
                className="size-[65px] rounded-full"
                onPress={() => setExpanded(!expanded)}
              >
                <Text className="text-lg font-bold">
                  <Icon
                    as={expanded ? ChevronsDownUp : ChevronsUpDown}
                    size={22}
                    strokeWidth={1.5}
                    className="text-primary"
                  />
                </Text>
              </Button>
              <Text className="text-center font-figtree-medium text-xs">
                {expanded ? "Show Less" : "Show More"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {minimize ? (
        <View className="absolute bottom-4 right-4">
          <Button
            onPress={() => router.push("/account/verification/identity")}
            size="icon"
            className="flex-col size-14 gap-0 rounded-full"
          >
            <UserCheck size={20} strokeWidth={1.5} color="#ffff" />
            <Text className="text-xs font-figtree-medium">Verify</Text>
          </Button>
        </View>
      ) : (
        <View className="absolute bottom-4 inset-x-4">
          <Alert icon={UserCheck} className="border-primary">
            <AlertTitle className="font-figtree-medium">
              Verify Account
            </AlertTitle>
            <AlertDescription className="text-sm font-figtree-regular">
              Get full access to all Kabaya services, get verified now!
            </AlertDescription>
            <View className="flex-row gap-2 items-center justify-end">
              <Button
                onPress={() => setMinimize(true)}
                size="sm"
                variant="link"
              >
                <Text className="font-figtree-medium">Minimize</Text>
              </Button>
              <Button
                onPress={() => router.push("/account/verification/identity")}
                size="sm"
              >
                <Text className="font-figtree-medium">Verify Now</Text>
              </Button>
            </View>
          </Alert>
        </View>
      )}
    </React.Fragment>
  );
}
