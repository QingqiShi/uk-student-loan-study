import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { LinkIndex, LinkIndexRow } from "@/components/instrument/LinkIndex";
import { Eyebrow } from "@/components/typography/Eyebrow";
import type { GuideEntry, GuideSlug } from "@/lib/guides";
import { GUIDES } from "@/lib/guides";

interface ExtraLink {
  href: string;
  label: string;
}

interface ToolLink {
  href: string;
  title: string;
  description: string;
}

/** Calculator/tool destinations a guide can cross-link to. */
const TOOLS: Partial<Record<string, ToolLink>> = {
  "/": {
    href: "/",
    title: "Student loan repayment calculator",
    description: "See how much you will repay in total at your salary.",
  },
  "/overpay": {
    href: "/overpay",
    title: "Overpay calculator",
    description: "Pay off faster or invest instead?",
  },
  "/repaid": {
    href: "/repaid",
    title: "When will it be paid off?",
    description: "Your payoff year and total lifetime repayments.",
  },
  "/balance": {
    href: "/balance",
    title: "Payoff timeline",
    description: "Watch your balance rise and fall year by year.",
  },
  "/interest": {
    href: "/interest",
    title: "Interest paid",
    description: "How much of your repayments is pure interest.",
  },
  "/effective-rate": {
    href: "/effective-rate",
    title: "Effective interest rate",
    description: "Your true rate vs the Bank of England base rate.",
  },
  "/which-plan": {
    href: "/which-plan",
    title: "Which plan quiz",
    description: "Find out which repayment plan you are on.",
  },
  "/plans": {
    href: "/plans",
    title: "Compare loan plans",
    description: "Thresholds, interest and write-off for every plan.",
  },
};

const DEFAULT_TOOLS = ["/", "/overpay"];

/** A quiet grouped block in the companion rail: engraved label + a link index. */
function RailGroup({
  label,
  children,
  labelId,
}: {
  label: string;
  labelId: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={labelId}>
      <Eyebrow as="h2" marker={false} id={labelId}>
        {label}
      </Eyebrow>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

interface RelatedGuidesProps {
  current: GuideSlug;
  order: GuideSlug[];
  extraLinks?: ExtraLink[];
  /** Calculator hrefs to feature under "More tools" (keys of TOOLS). */
  tools?: string[];
}

/**
 * The guide companion — the content of a guide's right-anchored rail (and, below
 * the workspace breakpoint, the closing block beneath the article). It opens
 * with a standing wayfinding link into the calculator, then a compact index of
 * related guides, optional references, and the guide's other tools. Set quietly
 * (engraved labels + hairline-separated rows) so it frames the reading column
 * without competing with it.
 */
export function RelatedGuides({
  current,
  order,
  extraLinks,
  tools = DEFAULT_TOOLS,
}: RelatedGuidesProps) {
  const guidesBySlug = new Map(GUIDES.map((g) => [g.slug, g]));
  const orderedGuides = order
    .filter((slug) => slug !== current)
    .map((slug) => guidesBySlug.get(slug))
    .filter((g): g is GuideEntry => g !== undefined)
    .slice(0, 3);

  // The main calculator is the standing call-to-action, so drop it from the
  // "More tools" index to avoid listing the same destination twice.
  const toolLinks = tools
    .filter((href) => href !== "/")
    .map((href) => TOOLS[href])
    .filter((t): t is ToolLink => t !== undefined);

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="group block no-underline"
        aria-labelledby="companion-cta-h"
      >
        <Eyebrow marker={false}>Try it yourself</Eyebrow>
        <span
          id="companion-cta-h"
          className="mt-2 flex items-center gap-1.5 font-semibold text-foreground transition-colors group-hover:text-cta"
        >
          Open the calculator
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-[3px]"
          />
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">
          See what you will actually repay at your salary.
        </span>
      </Link>

      {orderedGuides.length > 0 && (
        <RailGroup label="Related guides" labelId="related-guides-h">
          <LinkIndex>
            {orderedGuides.map((guide) => (
              <LinkIndexRow
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                title={guide.title}
                description={guide.description}
              />
            ))}
          </LinkIndex>
        </RailGroup>
      )}

      {extraLinks && extraLinks.length > 0 && (
        <RailGroup label="References" labelId="references-h">
          <LinkIndex>
            {extraLinks.map((link) => (
              <LinkIndexRow
                key={link.href}
                href={link.href}
                title={link.label}
                external
              />
            ))}
          </LinkIndex>
        </RailGroup>
      )}

      {toolLinks.length > 0 && (
        <RailGroup label="More tools" labelId="more-tools-h">
          <LinkIndex>
            {toolLinks.map((tool) => (
              <LinkIndexRow
                key={tool.href}
                href={tool.href}
                title={tool.title}
                description={tool.description}
              />
            ))}
          </LinkIndex>
        </RailGroup>
      )}
    </div>
  );
}
