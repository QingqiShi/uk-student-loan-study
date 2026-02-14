import type { Metadata } from "next";
import { AppErrorBoundary } from "@/components/ErrorBoundary";
import { PayUpfrontGuide } from "@/components/guides/pay-upfront-or-take-loan/PayUpfrontGuide";

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
