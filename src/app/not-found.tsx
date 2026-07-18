import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Link from "next/link";
import { Panel } from "@/components/instrument/Panel";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Heading } from "@/components/typography/Heading";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you were looking for doesn't exist. Browse our UK student loan calculators, tools, and guides.",
  robots: {
    index: false,
    follow: true,
  },
};

const SUGGESTED_LINKS = [
  {
    href: "/",
    title: "Repayment forecast",
    description:
      "See how long it takes to pay off your student loan at your salary.",
  },
  {
    href: "/overpay",
    title: "Overpay calculator",
    description:
      "Find out if paying extra towards your student loan is worth it.",
  },
  {
    href: "/which-plan",
    title: "Which plan quiz",
    description:
      "Not sure which loan plan you're on? Answer 3 quick questions.",
  },
  {
    href: "/guides",
    title: "All guides",
    description:
      "In-depth explainers on interest, thresholds, Plan 2 vs 5, and more.",
  },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-3 py-10 sm:py-14"
      >
        {/* Quiet readout — the figure is the status code */}
        <Eyebrow>Status</Eyebrow>
        <p className="mt-4 font-mono text-hero leading-none font-semibold tracking-tight text-signal tabular-nums">
          404
        </p>
        <Heading as="h1" size="page" className="mt-5">
          Page not found
        </Heading>
        <p className="mt-3 max-w-[60ch] text-muted-foreground">
          The page you were looking for doesn&rsquo;t exist or may have been
          moved. Head back to the calculator, or pick up one of these instead.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex w-fit items-center gap-1.5 font-semibold text-cta underline decoration-cta/40 underline-offset-4 transition-colors hover:decoration-cta focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Back to the repayment forecast
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        </Link>

        {/* Flat spec-sheet of suggested pages */}
        <Panel padding={false} className="mt-10 overflow-hidden">
          <ul className="divide-y divide-border">
            {SUGGESTED_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset sm:p-5"
                >
                  <div className="min-w-0 space-y-1">
                    <h2 className="font-semibold text-foreground transition-colors group-hover:text-cta group-focus-visible:text-cta">
                      {link.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="size-4 shrink-0 text-faint transition-all group-hover:translate-x-0.5 group-hover:text-primary group-focus-visible:text-primary"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </main>
      <Footer />
    </div>
  );
}
