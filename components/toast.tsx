import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, Info, X } from "lucide-react-native";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
  index: number;
}

const { width: screenWidth } = Dimensions.get("window");
const DYNAMIC_ISLAND_HEIGHT = 37;
const EXPANDED_HEIGHT = 85;
const TOAST_MARGIN = 8;
const DYNAMIC_ISLAND_WIDTH = 126;
const EXPANDED_WIDTH = screenWidth - 32;

// Reanimated spring configuration
const SPRING_CONFIG = {
  stiffness: 120,
  damping: 8,
};

export function Toast({
  id,
  title,
  description,
  variant = "default",
  onDismiss,
  index,
  action,
}: ToastProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Reanimated shared values
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const width = useSharedValue(DYNAMIC_ISLAND_WIDTH);
  const height = useSharedValue(DYNAMIC_ISLAND_HEIGHT);
  const borderRadius = useSharedValue(18.5);
  const contentOpacity = useSharedValue(0);

  // Dynamic Island colors (dark theme optimized)
  const mutedTextColor = "#8E8E93"; // iOS secondary text color

  useEffect(() => {
    const hasContentToShow = Boolean(title || description || action);

    if (hasContentToShow) {
      // If there's content, start directly with expanded state
      width.value = EXPANDED_WIDTH;
      height.value = EXPANDED_HEIGHT;
      borderRadius.value = 20;
      setIsExpanded(true);

      translateY.value = withTiming(0, { duration: 250 });
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1, { duration: 250 });
      contentOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
    } else {
      // If no content, show compact Dynamic Island with icon only
      setIsExpanded(false);

      // Animate in compact toast
      translateY.value = withSpring(0, SPRING_CONFIG);
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, SPRING_CONFIG);
    }
  }, [
    action,
    borderRadius,
    contentOpacity,
    description,
    height,
    opacity,
    scale,
    title,
    translateY,
    width,
  ]); // This effect should only run once when the toast mounts

  const getVariantColor = () => {
    switch (variant) {
      case "success":
        return "#30D158"; // iOS green
      case "error":
        return "#FF453A"; // iOS red
      case "warning":
        return "#FF9F0A"; // iOS orange
      case "info":
        return "#007AFF"; // iOS blue
      default:
        return "#8E8E93"; // iOS gray
    }
  };

  const getIcon = () => {
    const iconProps = { size: 16, color: getVariantColor() };

    switch (variant) {
      case "success":
        return <Check {...iconProps} />;
      case "error":
        return <X {...iconProps} />;
      case "warning":
        return <AlertCircle {...iconProps} />;
      case "info":
        return <Info {...iconProps} />;
      default:
        return null;
    }
  };

  const dismiss = useCallback(() => {
    // This function will be called from the UI thread
    const onDismissAction = () => {
      "worklet";
      runOnJS(onDismiss)(id);
    };

    translateY.value = withTiming(-100, { duration: 250 });
    opacity.value = withTiming(0, { duration: 250 }, (finished) => {
      if (finished) {
        onDismissAction();
      }
    });
    scale.value = withTiming(0.8, { duration: 250 });
  }, [id, onDismiss, opacity, scale, translateY]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;

      if (
        Math.abs(translationX) > screenWidth * 0.25 ||
        Math.abs(velocityX) > 800
      ) {
        // Dismiss action to be called from the UI thread
        const onDismissAction = () => {
          "worklet";
          runOnJS(onDismiss)(id);
        };

        // Animate out horizontally
        translateX.value = withTiming(
          translationX > 0 ? screenWidth : -screenWidth,
          { duration: 250 }
        );
        opacity.value = withTiming(0, { duration: 250 }, (finished) => {
          if (finished) {
            onDismissAction();
          }
        });
      } else {
        // Snap back without bounce
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  const getTopPosition = () => {
    const statusBarHeight = Platform.OS === "ios" ? 59 : 20;
    return statusBarHeight + index * (EXPANDED_HEIGHT + TOAST_MARGIN);
  };

  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  const animatedIslandStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const toastStyle: ViewStyle = {
    position: "absolute",
    top: getTopPosition(),
    alignSelf: "center",
    elevation: 10,
    zIndex: 1000 + index,
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[toastStyle, animatedContainerStyle]}>
        <Animated.View
          style={animatedIslandStyle}
          className="bg-card border border-border rounded-md"
        >
          {/* Compact state - just icon or indicator */}
          {!isExpanded && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {getIcon()}
            </View>
          )}

          {/* Expanded state - full content */}
          {isExpanded && (
            <Animated.View
              style={[
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                },
                animatedContentStyle,
              ]}
            >
              {getIcon() && (
                <View style={{ marginRight: 12 }}>{getIcon()}</View>
              )}

              <View style={{ flex: 1, minWidth: 0 }}>
                {title && (
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className={cn(
                      "font-figtree-medium",
                      description ? "mb-1" : "mb-0"
                    )}
                  >
                    {title}
                  </Text>
                )}
                {description && (
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    className="text-muted-foreground text-sm font-figtree-regular"
                  >
                    {description}
                  </Text>
                )}
              </View>

              {action && (
                <TouchableOpacity
                  onPress={action.onPress}
                  style={{
                    marginLeft: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: getVariantColor(),
                    borderRadius: 12,
                  }}
                >
                  <Text className="text-xs font-figtree-medium">
                    {action.label}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={dismiss}
                style={{ marginLeft: 8, padding: 4, borderRadius: 8 }}
              >
                <X size={14} color={mutedTextColor} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

interface ToastContextType {
  toast: (toast: Omit<ToastData, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 1 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toastData: Omit<ToastData, "id">) => {
      const id = generateId();
      const newToast: ToastData = {
        ...toastData,
        id,
        duration: toastData.duration ?? 4000,
      };

      setToasts((prev) => {
        const updated = [newToast, ...prev];
        return updated.slice(0, maxToasts);
      });

      // Auto dismiss after duration
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, newToast.duration);
      }
    },
    [dismissToast, maxToasts]
  );

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const createVariantToast = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      addToast({
        title,
        description,
        variant,
      });
    },
    [addToast]
  );

  const contextValue: ToastContextType = {
    toast: addToast,
    success: (title, description) =>
      createVariantToast("success", title, description),
    error: (title, description) =>
      createVariantToast("error", title, description),
    warning: (title, description) =>
      createVariantToast("warning", title, description),
    info: (title, description) =>
      createVariantToast("info", title, description),
    dismiss: dismissToast,
    dismissAll,
  };

  const containerStyle: ViewStyle = {
    position: "absolute",
    top: 16,
    left: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: "box-none",
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <View style={containerStyle} pointerEvents="box-none">
        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            {...toast}
            index={index}
            onDismiss={dismissToast}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
