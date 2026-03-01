import { Skeleton } from "@/components/ui/skeleton";

interface PayoffHeroStatsProps {
  payoffYears: number;
  writtenOff: boolean;
  totalPaidAmount?: string;
  aheadOfSchedule: boolean;
}

function OutcomeBadge({
  writtenOff,
  totalPaidAmount,
  aheadOfSchedule,
}: {
  writtenOff: boolean;
  totalPaidAmount?: string;
  aheadOfSchedule: boolean;
}) {
  if (writtenOff) {
    return (
      <span className="inline-flex rounded-md border border-status-warning-border bg-status-warning px-2 py-0.5 text-xs font-medium text-status-warning-foreground">
        Written off after paying a total of {totalPaidAmount}
      </span>
    );
  }

  if (aheadOfSchedule) {
    return (
      <span className="inline-flex rounded-md border border-status-success-border bg-status-success px-2 py-0.5 text-xs font-medium text-status-success-foreground">
        Paid in full — ahead of schedule
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-md border border-status-success-border bg-status-success px-2 py-0.5 text-xs font-medium text-status-success-foreground">
      Paid in full
    </span>
  );
}

export function PayoffHeroStats({
  payoffYears,
  writtenOff,
  totalPaidAmount,
  aheadOfSchedule,
}: PayoffHeroStatsProps) {
  return (
    <div className="flex animate-timeline-enter flex-wrap items-baseline justify-end gap-x-3 gap-y-1">
      <OutcomeBadge
        writtenOff={writtenOff}
        totalPaidAmount={totalPaidAmount}
        aheadOfSchedule={aheadOfSchedule}
      />
      <p
        className="font-mono text-2xl font-bold tabular-nums"
        style={{ color: writtenOff ? "var(--chart-5)" : "var(--chart-1)" }}
      >
        {payoffYears} years
      </p>
    </div>
  );
}

export function PayoffHeroStatsSkeleton() {
  return (
    <div className="flex items-baseline justify-end gap-3">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-7 w-36" />
    </div>
  );
}
