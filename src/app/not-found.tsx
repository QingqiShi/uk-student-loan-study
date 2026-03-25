import { ArrowRight01Icon, FileNotFoundIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Heading } from "@/components/typography/Heading";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you were looking for doesn't exist. Browse our UK student loan calculators, tools, and guides.",
};

const SUGGESTED_LINKS = [
  {
    href: "/",
    title: "Repayment Forecast",
    description:
      "See how long it takes to pay off your student loan at your salary.",
  },
  {
    href: "/overpay",
    title: "Overpay Calculator",
    description:
      "Find out if paying extra towards your student loan is worth it.",
  },
  {
    href: "/which-plan",
    title: "Which Plan Quiz",
    description:
      "Not sure which loan plan you're on? Answer 3 quick questions.",
  },
  {
    href: "/guides",
    title: "All Guides",
    description:
      "In-depth explainers on interest, thresholds, Plan 2 vs 5, and more.",
  },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-3 pt-16 pb-12 sm:pt-24"
      >
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground sm:size-20">
          <HugeiconsIcon
            icon={FileNotFoundIcon}
            className="size-8 sm:size-10"
          />
        </div>

        <Heading as="h1" size="page" className="mt-6 text-center">
          Page not found
        </Heading>
        <p className="mt-3 max-w-md text-center text-muted-foreground">
          The page you were looking for doesn&apos;t exist or may have been
          moved. Try one of these instead:
        </p>

        <div className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
          {SUGGESTED_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="group block">
              <div className="flex h-full flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition-all duration-200 hover:bg-accent hover:ring-primary/30">
                <h2 className="font-medium">{link.title}</h2>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">
                  {link.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                  Go
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
