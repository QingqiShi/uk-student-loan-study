import {
  MetricCell,
  MetricReadout,
} from "@/components/instrument/MetricReadout";

interface InterestHeroStatsProps {
  totalInterestPaid: string;
  /** Formatted currency. Empty string when there is no principal line to show. */
  principalPaid: string;
  /** 0–100 — the share of settled repayments that is interest. */
  interestPct: number;
  writtenOff: boolean;
  /** Gross interest actually charged (write-off scenarios), already formatted. */
  attributedInterestPaid: string;
}

export function InterestHeroStats({
  totalInterestPaid,
  principalPaid,
  interestPct,
  writtenOff,
  attributedInterestPaid,
}: InterestHeroStatsProps) {
  return (
    <MetricReadout columns={3} className="animate-timeline-enter">
      <MetricCell
        label={writtenOff ? "Interest paid · adj." : "Interest paid"}
        value={totalInterestPaid}
        tone="cost"
      />
      <MetricCell label="Interest share" value={`${String(interestPct)}%`} />
      {writtenOff ? (
        <MetricCell label="Interest charged" value={attributedInterestPaid} />
      ) : (
        <MetricCell label="Principal repaid" value={principalPaid || "—"} />
      )}
    </MetricReadout>
  );
}

export function InterestHeroStatsSkeleton() {
  return (
    <MetricReadout columns={3}>
      <MetricCell label="Interest paid" loading tone="cost" />
      <MetricCell label="Interest share" loading />
      <MetricCell label="Principal repaid" loading />
    </MetricReadout>
  );
}
