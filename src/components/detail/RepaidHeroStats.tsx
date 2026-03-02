import { Skeleton } from "@/components/ui/skeleton";

interface RepaidHeroStatsProps {
  totalRepaid: string;
  writtenOff: boolean;
  payoffYears: number;
  aheadOfSchedule: boolean;
}

function OutcomeBadge({
  writtenOff,
  payoffYears,
  aheadOfSchedule,
}: {
  writtenOff: boolean;
  payoffYears: number;
  aheadOfSchedule: boolean;
}) {
  if (writtenOff) {
    return (
      <span className="inline-flex rounded-md border border-status-warning-border bg-status-warning px-2 py-0.5 text-xs font-medium text-status-warning-foreground">
        Written off after {payoffYears} years
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

export function RepaidHeroStats({
  totalRepaid,
  writtenOff,
  payoffYears,
  aheadOfSchedule,
}: RepaidHeroStatsProps) {
  return (
    <div className="flex animate-timeline-enter flex-wrap items-center justify-end gap-x-3 gap-y-1">
      <OutcomeBadge
        writtenOff={writtenOff}
        payoffYears={payoffYears}
        aheadOfSchedule={aheadOfSchedule}
      />
      <p
        className="font-mono text-2xl font-bold tabular-nums"
        style={{ color: writtenOff ? "var(--chart-5)" : "var(--chart-1)" }}
      >
        {totalRepaid}
      </p>
    </div>
  );
}

export function RepaidHeroStatsSkeleton() {
  return (
    <div className="flex items-baseline justify-center gap-3">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-7 w-36" />
    </div>
  );
}
