import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finish setting up",
  robots: { index: false, follow: false },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
