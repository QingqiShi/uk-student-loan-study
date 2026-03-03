import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface InterestHeroStatsProps {
  totalInterestPaid: string;
  /** Formatted currency. Pass empty string to omit the principal subtext line. */
  totalPrincipalPaid: string;
  /** 0–100, used for the "X% interest" badge (paid-in-full only) */
  interestPct: number;
  writtenOff: boolean;
  /** For the write-off info popover text */
  payoffYears: number;
  /** Actual interest attributed via payment attribution — for the write-off popover */
  attributedInterestPaid: string;
  accentColor: string;
}

export function InterestHeroStats({
  totalInterestPaid,
  totalPrincipalPaid,
  interestPct,
  writtenOff,
  payoffYears,
  attributedInterestPaid,
  accentColor,
}: InterestHeroStatsProps) {
  return (
    <div className="animate-timeline-enter text-right">
      <div className="flex items-center justify-end gap-x-3">
        {writtenOff ? (
          <Popover>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="How is this interest figure calculated?"
                />
              }
            >
              <HugeiconsIcon icon={InformationCircleIcon} className="size-5" />
            </PopoverTrigger>
            <PopoverContent side="top" className="text-sm">
              You paid {attributedInterestPaid} in interest charges over{" "}
              {payoffYears} years. When the loan is written off, the remaining
              balance is cleared — we treat that as a final principal repayment,
              so the adjusted figure shows only what you repaid on top of your
              original loan amount.
            </PopoverContent>
          </Popover>
        ) : (
          <Badge variant="outline" className="rounded-md">
            {interestPct}% interest
          </Badge>
        )}
        <p
          className="font-mono text-2xl font-bold tabular-nums"
          style={{ color: accentColor }}
        >
          {totalInterestPaid}
        </p>
      </div>
      <p
        className={cn(
          "text-xs text-muted-foreground",
          !totalPrincipalPaid && "invisible",
        )}
      >
        + {totalPrincipalPaid} principal
      </p>
    </div>
  );
}

export function InterestHeroStatsSkeleton() {
  return (
    <div className="flex items-center justify-end gap-3">
      <Skeleton className="h-5 w-24" />
      <div className="space-y-1 text-right">
        <Skeleton className="ml-auto h-7 w-36" />
        <Skeleton className="ml-auto h-4 w-28" />
      </div>
    </div>
  );
}
