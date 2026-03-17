import { MovingAbroadGuide } from "@/components/guides/moving-abroad/MovingAbroadGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function MovingAbroadRoute() {
  return (
    <AppErrorBoundary>
      <MovingAbroadGuide />
    </AppErrorBoundary>
  );
}
