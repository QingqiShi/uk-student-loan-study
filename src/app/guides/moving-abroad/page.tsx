import type { Metadata } from "next";
import { MovingAbroadGuide } from "@/components/guides/moving-abroad/MovingAbroadGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

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
