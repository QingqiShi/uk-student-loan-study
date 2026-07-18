import { Sparkline } from "@/components/charts/Sparkline";
import {
  MetricCell,
  MetricReadout,
} from "@/components/instrument/MetricReadout";
import type { SparklinePoint } from "@/types/insightCards";
import { OutcomeBadge } from "./OutcomeBadge";

interface PayoffHeroStatsProps {
  payoffYears: number;
  peakBalance: string;
  totalRepaid: string;
  writtenOff: boolean;
  totalWrittenOffAmount?: string;
  aheadOfSchedule: boolean;
  sparkline: SparklinePoint[];
}

export function PayoffHeroStats({
  payoffYears,
  peakBalance,
  totalRepaid,
  writtenOff,
  totalWrittenOffAmount,
  aheadOfSchedule,
  sparkline,
}: PayoffHeroStatsProps) {
  return (
    <MetricReadout columns={3} className="animate-timeline-enter">
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
        tone="emphasis"
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
      <MetricCell label="Peak balance" value={peakBalance} tone="cost">
        <Sparkline
          data={sparkline}
          color="var(--signal)"
          ariaLabel={`Loan balance over time, peaking at ${peakBalance}`}
        />
      </MetricCell>
      {writtenOff ? (
        <MetricCell
          label="Balance written off"
          value={totalWrittenOffAmount ?? "—"}
          tone="cost"
        />
      ) : (
        <MetricCell label="Total repaid" value={totalRepaid} />
      )}
    </MetricReadout>
  );
}

export function PayoffHeroStatsSkeleton() {
  return (
    <MetricReadout columns={3}>
      <MetricCell label="Cleared in" loading tone="emphasis" />
      <MetricCell label="Peak balance" loading tone="cost" />
      <MetricCell label="Total repaid" loading />
    </MetricReadout>
  );
}
