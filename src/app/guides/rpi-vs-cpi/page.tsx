import type { Metadata } from "next";
import { AppErrorBoundary } from "@/components/ErrorBoundary";
import { RpiVsCpiGuide } from "@/components/guides/rpi-vs-cpi/RpiVsCpiGuide";

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
