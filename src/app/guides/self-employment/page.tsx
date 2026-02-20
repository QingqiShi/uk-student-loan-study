import type { Metadata } from "next";
import { SelfEmploymentGuide } from "@/components/guides/self-employment/SelfEmploymentGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export const metadata: Metadata = {
  alternates: { canonical: "/guides/self-employment" },
};

export default function SelfEmploymentRoute() {
  return (
    <AppErrorBoundary>
      <SelfEmploymentGuide />
    </AppErrorBoundary>
  );
}
