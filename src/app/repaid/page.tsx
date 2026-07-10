import type { Metadata } from "next";
import { RepaidDetailPage } from "@/components/detail/RepaidDetailPage";
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
    const defaultTitle = "When Will My Student Loan Be Paid Off?";
    const defaultDescription =
      "Find out when your UK student loan will be paid off — or written off — and what it will cost in total. Enter your salary, balance and plan (1, 2, 4, 5 or Postgraduate) to see your payoff year and total repayments.";

    return {
      title: defaultTitle,
      description: defaultDescription,
      alternates: { canonical: "/repaid" },
      openGraph: {
        title: defaultTitle,
        description: defaultDescription,
        url: "https://studentloanstudy.uk/repaid",
        type: "website",
      },
    };
  }

  const title = `${meta.planName} loan of ${meta.formattedBalance} at ${meta.formattedSalary} — Total Repayments`;
  const description = `See the total repayment cost for a ${meta.planName} UK student loan with ${meta.formattedBalance} balance and ${meta.formattedSalary} annual salary.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://studentloanstudy.uk/repaid",
      type: "website",
    },
  };
}

export default function RepaidRoute() {
  return (
    <AppErrorBoundary>
      <RepaidDetailPage />
    </AppErrorBoundary>
  );
}
