import { Text } from "@/components/ui/text";
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  UserCheck,
} from "lucide-react-native";
import { Button } from "@/components/ui/button";
import React, { useCallback, useState } from "react";
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
  const { user, getUser } = useAuthContext();
  const [minimize, setMinimize] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { open } = useVerify();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getUser();
    setRefreshing(false);
  }, [getUser]);

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={["#E11D48"]}
            tintColor="#E11D48"
            onRefresh={onRefresh}
          />
        }
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

      {!user?.is_verified &&
        (minimize ? (
          <View className="absolute bottom-4 right-4">
            <Button
              onPress={() => {
                if (user?.verification_status !== "pending") {
                  router.push("/account/verification/identity");
                }
              }}
              size="icon"
              className="flex-col size-14 gap-0 rounded-full"
            >
              <UserCheck size={20} strokeWidth={1.5} color="#ffff" />
              <Text className="text-xs font-figtree-medium">
                {user?.verification_status === "pending" ? "Review" : "Verify"}
              </Text>
            </Button>
          </View>
        ) : (
          <View className="absolute bottom-4 inset-x-4">
            <Alert icon={UserCheck} className="border-primary">
              <AlertTitle className="font-figtree-medium">
                {user?.verification_status === "pending"
                  ? "Your account is under review"
                  : "Verify your account"}
              </AlertTitle>
              <AlertDescription className="text-sm font-figtree-regular">
                {user?.verification_status === "pending"
                  ? "We’re checking your account. Please wait a moment."
                  : "Verify now to enjoy more features and services."}
              </AlertDescription>
              <View className="flex-row gap-2 items-center justify-end">
                <Button
                  onPress={() => setMinimize(true)}
                  size="sm"
                  variant="link"
                >
                  <Text className="font-figtree-medium">Minimize</Text>
                </Button>
                {user?.verification_status !== "pending" && (
                  <Button
                    onPress={() =>
                      router.push("/account/verification/identity")
                    }
                    size="sm"
                  >
                    <Text className="font-figtree-medium">Verify Now</Text>
                    <Icon
                      as={ChevronRight}
                      strokeWidth={1.5}
                      size={18}
                      color="#ffff"
                    />
                  </Button>
                )}
              </View>
            </Alert>
          </View>
        ))}
    </React.Fragment>
  );
}
