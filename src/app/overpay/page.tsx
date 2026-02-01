import type { Metadata } from "next";
import { AppErrorBoundary } from "@/components/ErrorBoundary";
import { OverpayPage } from "@/components/overpay/OverpayPage";
import { parseMetadataParams } from "@/lib/metadata";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const meta = parseMetadataParams(params);

  // If no share params, use defaults
  if (!meta.hasShareParams) {
    return {
      title: "Should You Overpay? | UK Student Loan Study",
      description:
        "Find out if overpaying your UK student loan makes financial sense, or if you'd be better off investing instead.",
    };
  }

  const title = `Should you overpay a ${meta.planName} loan of ${meta.formattedBalance}?`;
  const description = `See if overpaying a ${meta.planName} UK student loan with ${meta.formattedBalance} balance at ${meta.formattedSalary} salary makes sense, or if investing is better.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default function OverpayRoute() {
  return (
    <AppErrorBoundary>
      <OverpayPage />
    </AppErrorBoundary>
  );
}
