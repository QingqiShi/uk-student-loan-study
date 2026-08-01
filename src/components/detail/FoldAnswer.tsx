import type { ReactNode } from "react";
import { Figure } from "@/components/typography/Figure";
import { Skeleton } from "@/components/ui/skeleton";
import { FOLD_NOTE } from "@/lib/layout";
import { cn } from "@/lib/utils";

/**
 * The figure ramp tops out at `fig-hero`, which is a step *below* a section
 * heading — right for one cell of a readout, wrong for the number a whole page
 * exists to report. The answer takes the heading scale instead, so the thing
 * the reader clicked through for is the largest thing on the page rather than
 * the masthead of the band beneath it.
 */
const FIGURE_TONE: Record<"emphasis" | "cost", string> = {
  emphasis: "text-foreground",
  cost: "text-signal",
};

/**
 * A detail page's answer: the figure the reader clicked through to see, and the
 * reading of it in words.
 *
 * The overpay fold puts its verdict at the top of the rail because that is the
 * page's conclusion; a detail page's conclusion is a number, so the number goes
 * there, at the same scale, with the sentence that interprets it directly under
 * it. Nothing labels the figure inside this block — the h1 directly above it is
 * the metric's name, so an engraved key here would be the same words twice.
 *
 * Only the answer: the supporting figures are the four cells in the fold's
 * right-hand rail, the same four the reader clicked to get here. Repeating one
 * of them beside its own expansion was the page saying the same number three
 * times in one screen.
 */
export function FoldAnswer({
  figure,
  tone = "emphasis",
  badge,
  claim,
  note,
}: {
  /**
   * The headline figure, preformatted — `Figure` drops a leading "£" and a
   * trailing unit word to their subordinate treatments.
   */
  figure: string;
  /** `emphasis` (ink, the default) or `cost` (clay, for an interest figure). */
  tone?: "emphasis" | "cost";
  /** Outcome pill set on the figure's baseline — paid off, written off. */
  badge?: ReactNode;
  /** The reading of the figure in one or two sentences. Set in ink: it is a claim. */
  claim: ReactNode;
  /** Small print qualifying the claim — an adjusted-figure caveat, say. */
  note?: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        {/* The figure keeps its own box: `Figure` renders the "£" and any
              trailing unit as siblings of the digits, and loose in a flex
              container each of those would become an item with a gap in it. */}
        <span
          data-slot="fold-answer-figure"
          className={cn(
            "font-mono text-page font-semibold tracking-tight tabular-nums",
            FIGURE_TONE[tone],
            // Trails the size utility: a font-size utility carries its own
            // line-height, so the readout's 1.0 leading has to be the last word.
            "leading-none",
          )}
        >
          <Figure value={figure} />
        </span>
        {badge}
      </p>
      {/* The `ch` caps hold the measure while the fold is stacked and this
            block has the whole page to run across. Once it is a rail, the rail
            is the measure: a cap narrower than the column it sits in wraps the
            sentence early and leaves a ragged margin beside it. */}
      <p className="mt-[clamp(0.7rem,1.1vw,1rem)] max-w-[46ch] text-lead leading-[1.45] text-pretty wide:max-w-none">
        {claim}
      </p>
      {note && (
        <div className={cn(FOLD_NOTE, "mt-2 space-y-2 wide:max-w-none")}>
          {note}
        </div>
      )}
    </div>
  );
}

/**
 * Holds the answer's shape while the simulation resolves, so the fold does not
 * reflow under the reader when the figures land.
 */
export function FoldAnswerSkeleton() {
  return (
    <div className="min-w-0" aria-hidden>
      <Skeleton className="h-[clamp(1.75rem,2.8vw,2.6rem)] w-56 max-w-full" />
      <div className="mt-[clamp(0.7rem,1.1vw,1rem)] max-w-[46ch] space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
