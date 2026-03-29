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
    return {};
  }

  const title = `${meta.planName} loan of ${meta.formattedBalance} at ${meta.formattedSalary} — Effective Rate`;
  const description = `See the true effective annual rate of a ${meta.planName} UK student loan with ${meta.formattedBalance} balance and ${meta.formattedSalary} annual salary.`;

  return {
    title,
    description,
    alternates: {
      canonical: "/effective-rate",
    },
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
