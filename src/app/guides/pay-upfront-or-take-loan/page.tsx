import type { Metadata } from "next";
import { PayUpfrontGuide } from "@/components/guides/pay-upfront-or-take-loan/PayUpfrontGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export const metadata: Metadata = {
  alternates: { canonical: "/guides/pay-upfront-or-take-loan" },
};

export default function PayUpfrontOrTakeLoanRoute() {
  return (
    <AppErrorBoundary>
      <PayUpfrontGuide />
    </AppErrorBoundary>
  );
}
