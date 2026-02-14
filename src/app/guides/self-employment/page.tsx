import type { Metadata } from "next";
import { AppErrorBoundary } from "@/components/ErrorBoundary";
import { SelfEmploymentGuide } from "@/components/guides/self-employment/SelfEmploymentGuide";

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
