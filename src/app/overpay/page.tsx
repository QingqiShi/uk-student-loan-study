import type { Metadata } from "next";
import { OverpayPage } from "@/components/overpay/OverpayPage";
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

  // No share params - use defaults from layout
  if (!meta.hasShareParams) {
    return {
      alternates: {
        canonical: "/overpay",
      },
    };
  }

  // Dynamic metadata for shared URLs
  const title = `Should you overpay a ${meta.planName} loan of ${meta.formattedBalance}?`;
  const description = `See if overpaying a ${meta.planName} UK student loan with ${meta.formattedBalance} balance at ${meta.formattedSalary} salary makes sense, or if investing is better.`;

  return {
    title,
    description,
    alternates: {
      canonical: "/overpay",
    },
    openGraph: {
      title,
      description,
      url: "https://studentloanstudy.uk/overpay",
      type: "website",
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
