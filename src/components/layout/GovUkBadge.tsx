import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LAST_UPDATED } from "@/lib/loans/plans";

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
          <Badge className={className}>
            <HugeiconsIcon icon={Tick02Icon} className="size-3" />
            GOV.UK {formattedDate}
          </Badge>
        }
      />
      <PopoverContent className="w-auto max-w-64 space-y-1.5">
        <p className="text-sm font-medium">
          Rates &amp; thresholds as of {formattedDate}
        </p>
        <p className="text-sm text-muted-foreground">
          Verified daily against GOV.UK and the Bank of England.
        </p>
        <Link
          href="/our-data"
          className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
        >
          How we stay current&nbsp;&rarr;
        </Link>
      </PopoverContent>
    </Popover>
  );
}
