import { RpiVsCpiGuide } from "@/components/guides/rpi-vs-cpi/RpiVsCpiGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function RpiVsCpiRoute() {
  return (
    <AppErrorBoundary>
      <RpiVsCpiGuide />
    </AppErrorBoundary>
  );
}
