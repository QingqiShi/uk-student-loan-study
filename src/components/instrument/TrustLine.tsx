import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { VerifiedAgo } from "@/components/instrument/VerifiedAgo";
import { cn } from "@/lib/utils";

/**
 * The standing provenance line beneath a page's opening statement: independent,
 * GOV.UK sourced, and when the figures were last verified. One component so the
 * homepage and the guides index make the same claim in the same words.
 */
export function TrustLine({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-[0.65rem] gap-y-[0.4rem] font-sans text-meta text-muted-foreground",
        className,
      )}
    >
      <HugeiconsIcon
        icon={Tick02Icon}
        className="size-3.5 shrink-0 text-primary"
        aria-hidden="true"
      />
      Independent <span className="text-faint">·</span> GOV.UK sourced{" "}
      <span className="text-faint">·</span> <VerifiedAgo />
    </p>
  );
}
