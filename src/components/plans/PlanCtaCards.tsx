import {
  AnalyticsUpIcon,
  ArrowRight01Icon,
  Calculator01Icon,
  Quiz01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

interface CtaCard {
  href: string;
  title: string;
  description: string;
  icon: typeof Calculator01Icon;
}

const CARDS: CtaCard[] = [
  {
    href: "/",
    title: "Student Loan Repayment Calculator",
    description: "See exactly how much you'll repay in total at your salary.",
    icon: Calculator01Icon,
  },
  {
    href: "/which-plan",
    title: "Which Plan Am I On?",
    description: "Answer 3 quick questions to confirm your plan type.",
    icon: Quiz01Icon,
  },
  {
    href: "/overpay",
    title: "Overpay Calculator",
    description: "Should you pay your loan off faster or invest instead?",
    icon: AnalyticsUpIcon,
  },
];

/** Prominent links to the core tools, shown at the foot of each plan page. */
export function PlanCtaCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {CARDS.map((card) => (
        <Link key={card.href} href={card.href} className="group block h-full">
          <div className="flex h-full flex-col rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-all duration-200 hover:bg-accent hover:ring-primary/30">
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <HugeiconsIcon icon={card.icon} className="size-5" />
            </div>
            <h3 className="text-sm font-medium">{card.title}</h3>
            <p className="mt-1 mb-3 flex-1 text-xs text-muted-foreground">
              {card.description}
            </p>
            <div className="flex items-center gap-1 text-xs font-medium text-primary">
              Open
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
