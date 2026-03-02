import { OutcomeBadge } from "./OutcomeBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface PayoffHeroStatsProps {
  payoffYears: number;
  writtenOff: boolean;
  totalPaidAmount?: string;
  aheadOfSchedule: boolean;
}

export function PayoffHeroStats({
  payoffYears,
  writtenOff,
  totalPaidAmount,
  aheadOfSchedule,
}: PayoffHeroStatsProps) {
  return (
    <div className="flex animate-timeline-enter flex-wrap items-center justify-end gap-x-3 gap-y-1">
      <OutcomeBadge
        writtenOff={writtenOff}
        writtenOffLabel={`after paying a total of ${totalPaidAmount ?? ""}`}
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
