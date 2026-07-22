import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { VerifiedAgo } from "@/components/instrument/VerifiedAgo";
import { badgeVariants } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LAST_UPDATED } from "@/lib/loans/plans";
import { cn } from "@/lib/utils";

const formattedDate = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
}).format(new Date(LAST_UPDATED));

export function GovUkBadge({ className }: { className?: string }) {
  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={200}
        closeDelay={150}
        render={
          // A plain button carrying the badge classes, NOT a nested <Badge
          // render={button}> — the nested render made base-ui emit a different
          // data-slot on the server vs client, which tripped a hydration
          // mismatch on every page. One element → one stable data-slot.
          <button type="button" className={cn(badgeVariants(), className)}>
            <HugeiconsIcon icon={Tick02Icon} className="size-3" />
            GOV.UK{" "}
            <span className="text-faint" aria-hidden="true">
              ·
            </span>{" "}
            {/* narrow: hides the "Verified" verb below sm to keep the chip
                compact (the component pairs that with a standalone fallback). */}
            <VerifiedAgo narrow />
            {/* Keep a machine-readable "as of" date in the always-rendered chip
                for crawlers and assistive tech; the popover's date only mounts
                when it opens. */}
            <time dateTime={LAST_UPDATED} className="sr-only">
              {" "}
              — figures last changed {formattedDate}
            </time>
          </button>
        }
      />
      <PopoverContent className="w-auto max-w-64 space-y-1.5">
        <p className="text-sm font-medium">
          Checked against GOV.UK and the Bank of England every morning.
        </p>
        <p className="text-sm text-muted-foreground">
          Figures last changed{" "}
          <time dateTime={LAST_UPDATED}>{formattedDate}</time>.
        </p>
        <Link
          href="/our-data"
          className="text-sm text-cta underline underline-offset-4 hover:text-cta/80"
        >
          How we stay current&nbsp;&rarr;
        </Link>
      </PopoverContent>
    </Popover>
  );
}
