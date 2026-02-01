import BalanceOverTimeChart from "./BalanceOverTimeChart";
import InterestRateChart from "./InterestRateChart";

export function SecondaryCharts() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-base font-semibold">Your Balance Over Time</h3>
        <p className="text-sm text-muted-foreground">
          See how your loan balance decreases over time based on your current
          salary. Watch it drop to zero—or reach the 30-year write-off point.
        </p>
        <div className="h-[300px] sm:h-[350px]">
          <BalanceOverTimeChart />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold">Effective Interest Rate</h3>
        <p className="text-sm text-muted-foreground">
          Compare your loan&apos;s effective rate against other investments.
          Lower earners often have negative effective rates due to write-off.
        </p>
        <div className="h-[300px] sm:h-[350px]">
          <InterestRateChart />
        </div>
      </section>
    </div>
  );
}

export default SecondaryCharts;
