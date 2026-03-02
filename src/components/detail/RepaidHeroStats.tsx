import { OutcomeBadge } from "./OutcomeBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface RepaidHeroStatsProps {
  totalRepaid: string;
  writtenOff: boolean;
  payoffYears: number;
  aheadOfSchedule: boolean;
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
        conditions={[
          {
            when: writtenOff,
            label: `Written off after ${String(payoffYears)} years`,
            variant: "warning",
          },
          {
            when: aheadOfSchedule,
            label: "Paid in full — ahead of schedule",
            variant: "success",
          },
          { when: true, label: "Paid in full", variant: "success" },
        ]}
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
