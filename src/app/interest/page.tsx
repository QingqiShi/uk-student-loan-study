import type { Metadata } from "next";
import { InterestDetailPage } from "@/components/detail/InterestDetailPage";
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

  const title = `${meta.planName} loan of ${meta.formattedBalance} at ${meta.formattedSalary} — Interest Breakdown`;
  const description = `See how much interest you pay on a ${meta.planName} UK student loan with ${meta.formattedBalance} balance and ${meta.formattedSalary} annual salary.`;

  return {
    title,
    description,
    alternates: {
      canonical: "/interest",
    },
    openGraph: {
      title,
      description,
      url: "https://studentloanstudy.uk/interest",
      type: "website",
    },
  };
}

export default function InterestRoute() {
  return (
    <AppErrorBoundary>
      <InterestDetailPage />
    </AppErrorBoundary>
  );
}
