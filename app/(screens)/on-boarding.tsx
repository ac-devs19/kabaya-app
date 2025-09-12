import { Onboarding as OB, OnboardingStep } from "@/components/onboarding";
import { router } from "expo-router";
import { Text } from "react-native";

const steps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Our App",
    description: "Discover amazing features and get started with your journey.",
    icon: <Text style={{ fontSize: 80 }}>👋</Text>,
  },
  {
    id: "features",
    title: "Powerful Features",
    description:
      "Experience cutting-edge functionality designed to make your life easier.",
    icon: <Text style={{ fontSize: 80 }}>⚡</Text>,
  },
  {
    id: "personalize",
    title: "Personalize Your Experience",
    description: "Customize the app to match your preferences and workflow.",
    icon: <Text style={{ fontSize: 80 }}>🎨</Text>,
  },
  {
    id: "ready",
    title: "You're All Set!",
    description:
      "Everything is ready. Let's start exploring what you can achieve.",
    icon: <Text style={{ fontSize: 80 }}>🚀</Text>,
  },
];

export default function Onboarding() {
  return (
    <OB
      steps={steps}
      onComplete={() => router.replace("/sign-up")}
      onSkip={() => router.replace("/sign-up")}
    />
  );
}
