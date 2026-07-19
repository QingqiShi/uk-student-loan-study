import { Sparkline } from "@/components/charts/Sparkline";
import {
  MetricCell,
  MetricReadout,
} from "@/components/instrument/MetricReadout";
import type { SparklinePoint } from "@/types/insightCards";
import { OutcomeBadge } from "./OutcomeBadge";

interface RepaidHeroStatsProps {
  totalRepaid: string;
  monthlyRepayment: string;
  writtenOff: boolean;
  payoffYears: number;
  aheadOfSchedule: boolean;
  sparkline: SparklinePoint[];
}

export function RepaidHeroStats({
  totalRepaid,
  monthlyRepayment,
  writtenOff,
  payoffYears,
  aheadOfSchedule,
  sparkline,
}: RepaidHeroStatsProps) {
  return (
    <MetricReadout columns={3} className="animate-timeline-enter">
      <MetricCell label="Total repaid" value={totalRepaid} tone="emphasis">
        <Sparkline
          data={sparkline}
          color="var(--chart-principal)"
          ariaLabel={`Cumulative repayments, totalling ${totalRepaid}`}
        />
      </MetricCell>
      <MetricCell label="Monthly repayment · start" value={monthlyRepayment} />
      <MetricCell
        label={writtenOff ? "Written off in" : "Cleared in"}
        value={
          <>
            {payoffYears}
            <span className="ml-1 font-sans text-base font-medium tracking-normal text-muted-foreground">
              years
            </span>
          </>
        }
      >
        <OutcomeBadge
          conditions={[
            { when: writtenOff, label: "Written off", variant: "warning" },
            {
              when: aheadOfSchedule,
              label: "Ahead of schedule",
              variant: "success",
            },
            { when: true, label: "Paid in full", variant: "success" },
          ]}
        />
      </MetricCell>
    </MetricReadout>
  );
}

export function RepaidHeroStatsSkeleton() {
  return (
    <MetricReadout columns={3}>
      <MetricCell label="Total repaid" loading tone="emphasis" />
      <MetricCell label="Monthly repayment · start" loading />
      <MetricCell label="Cleared in" loading />
    </MetricReadout>
  );
}
