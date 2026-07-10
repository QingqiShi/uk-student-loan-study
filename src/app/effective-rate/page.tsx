import type { Metadata } from "next";
import { EffectiveRateDetailPage } from "@/components/detail/EffectiveRateDetailPage";
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
    const defaultTitle =
      "Student Loan Effective Interest Rate — Your True Cost";
    const defaultDescription =
      "See the true effective interest rate on your UK student loan versus the Bank of England base rate. Middle earners pay the most — they repay in full while low and high earners get more written off.";

    return {
      title: defaultTitle,
      description: defaultDescription,
      alternates: { canonical: "/effective-rate" },
      openGraph: {
        title: defaultTitle,
        description: defaultDescription,
        url: "https://studentloanstudy.uk/effective-rate",
        type: "website",
      },
    };
  }

  const title = `${meta.planName} loan of ${meta.formattedBalance} at ${meta.formattedSalary} — Effective Rate`;
  const description = `See the true effective annual rate of a ${meta.planName} UK student loan with ${meta.formattedBalance} balance and ${meta.formattedSalary} annual salary.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://studentloanstudy.uk/effective-rate",
      type: "website",
    },
  };
}

export default function EffectiveRateRoute() {
  return (
    <AppErrorBoundary>
      <EffectiveRateDetailPage />
    </AppErrorBoundary>
  );
}
