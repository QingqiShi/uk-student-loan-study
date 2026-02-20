import type { Metadata } from "next";
import { RpiVsCpiGuide } from "@/components/guides/rpi-vs-cpi/RpiVsCpiGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export const metadata: Metadata = {
  alternates: { canonical: "/guides/rpi-vs-cpi" },
};

export default function RpiVsCpiRoute() {
  return (
    <AppErrorBoundary>
      <RpiVsCpiGuide />
    </AppErrorBoundary>
  );
}
