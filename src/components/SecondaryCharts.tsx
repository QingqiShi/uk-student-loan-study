import { BalanceOverTimeChart } from "./BalanceOverTimeChart";

export function SecondaryCharts() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Your Balance Over Time
        </h2>
        <div className="h-75 sm:h-88">
          <BalanceOverTimeChart />
        </div>
      </section>
    </div>
  );
}
