import type { Metadata } from "next";
import { App } from "@/components/App";
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

  // No share params - use defaults from root layout, just add canonical
  if (!meta.hasShareParams) {
    return {
      alternates: {
        canonical: "/",
      },
    };
  }

  // Dynamic metadata for shared URLs
  const title = `${meta.planName} loan of ${meta.formattedBalance} at ${meta.formattedSalary} salary`;
  const description = `See the repayment projection for a ${meta.planName} UK student loan with ${meta.formattedBalance} balance and ${meta.formattedSalary} annual salary.`;

  return {
    title,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: "https://studentloanstudy.uk",
      type: "website",
    },
  };
}

export default function Home() {
  return (
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
}
