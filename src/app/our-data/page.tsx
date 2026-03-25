import { OurDataPage } from "@/components/our-data/OurDataPage";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function OurDataRoute() {
  return (
    <AppErrorBoundary>
      <OurDataPage />
    </AppErrorBoundary>
  );
}
