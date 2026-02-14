import { BalanceOverTimeChart } from "./BalanceOverTimeChart";

export function SecondaryCharts() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Your Balance Over Time
        </h2>
        <div className="h-[300px] sm:h-[350px]">
          <BalanceOverTimeChart />
        </div>
      </section>
    </div>
  );
}
