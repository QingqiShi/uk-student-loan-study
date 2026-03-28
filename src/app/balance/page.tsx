import type { Metadata } from "next";
import { BalanceDetailPage } from "@/components/detail/BalanceDetailPage";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";
import { parseMetadataParams } from "@/lib/metadata";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const meta = parseMetadataParams(params);

  if (!meta.hasShareParams) {
    return {};
  }

  const title = `${meta.planName} loan of ${meta.formattedBalance} at ${meta.formattedSalary} — Payoff Timeline`;
  const description = `See how long it takes to pay off a ${meta.planName} UK student loan with ${meta.formattedBalance} balance and ${meta.formattedSalary} annual salary.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://studentloanstudy.uk/balance",
      type: "website",
    },
  };
}

export default function BalanceRoute() {
  return (
    <AppErrorBoundary>
      <BalanceDetailPage />
    </AppErrorBoundary>
  );
}
