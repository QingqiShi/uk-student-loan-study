import type { Metadata } from "next";
import { AppErrorBoundary } from "@/components/ErrorBoundary";
import { MovingAbroadGuide } from "@/components/guides/moving-abroad/MovingAbroadGuide";

export const metadata: Metadata = {
  alternates: {
    canonical: "/guides/moving-abroad",
  },
};

export default function MovingAbroadRoute() {
  return (
    <AppErrorBoundary>
      <MovingAbroadGuide />
    </AppErrorBoundary>
  );
}
