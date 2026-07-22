import Link from "next/link";
import { HomeSection } from "./HomeSection";

interface ToolLink {
  title: string;
  href: string;
  description: string;
}

// Approved order + wording.
const TOOLS: ToolLink[] = [
  {
    title: "Which plan am I on?",
    href: "/which-plan",
    description: "A two-question check to find your repayment plan.",
  },
  {
    title: "Overpayment calculator",
    href: "/overpay",
    description:
      "Test whether overpaying actually saves you money on your plan.",
  },
  {
    title: "Compare plans",
    href: "/plans",
    description: "Compare Plans 1, 2, 4, 5 and postgraduate side by side.",
  },
  {
    title: "Moving abroad",
    href: "/guides/moving-abroad",
    description: "How thresholds and repayments work if you leave the UK.",
  },
  {
    title: "All guides",
    href: "/guides",
    description: "Every guide on UK student loan repayment, in one place.",
  },
];

export function ToolsSection() {
  return (
    <HomeSection
      id="tools"
      heading="Go deeper on your own numbers"
      intro="Free, independent, and built on the same GOV.UK figures as the calculator above."
    >
      <div className="mt-[clamp(1.6rem,2.4vw,2.4rem)] grid grid-cols-1 gap-x-[clamp(2rem,3vw,3.5rem)] gap-y-[clamp(0.4rem,1vw,1rem)] roomy:grid-cols-3 work:mt-0">
        {TOOLS.map((tool) => (
          <Link
            className="group grid grid-cols-[1fr_auto] items-baseline gap-x-[0.6rem] py-[0.55rem] no-underline"
            href={tool.href}
            key={tool.href}
          >
            <span className="text-lead font-semibold tracking-[-0.011em] transition-colors duration-150 ease-[ease] group-hover:text-primary">
              {tool.title}
            </span>
            <span
              className="text-primary transition-transform duration-150 ease-[ease] group-hover:translate-x-[3px]"
              aria-hidden="true"
            >
              →
            </span>
            <span className="col-span-full mt-1 text-sm/normal text-pretty text-muted-foreground">
              {tool.description}
            </span>
          </Link>
        ))}
      </div>
    </HomeSection>
  );
}
