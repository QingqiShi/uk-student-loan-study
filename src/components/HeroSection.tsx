import { AdvancedConfigSection } from "./AdvancedConfigSection";
import { QuickInputs } from "./QuickInputs";
import { ResultSummary } from "./ResultSummary";
import TotalRepaymentChart from "./TotalRepaymentChart";

export function HeroSection() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
          Student Loans Hurt{" "}
          <span className="text-primary">Middle Earners</span> Most
        </h2>
        <ul className="max-w-2xl space-y-1 text-base text-muted-foreground sm:text-lg">
          <li className="flex items-baseline gap-2">
            <span className="size-1.5 shrink-0 -translate-y-px rounded-full bg-primary/40" />
            Low earners get their loans written off.
          </li>
          <li className="flex items-baseline gap-2">
            <span className="size-1.5 shrink-0 -translate-y-px rounded-full bg-primary/40" />
            High earners pay them off quickly.
          </li>
          <li className="flex items-baseline gap-2 text-foreground">
            <span className="size-1.5 shrink-0 -translate-y-px rounded-full bg-primary" />
            Middle earners pay the most in total—and the most interest.
          </li>
        </ul>
      </div>

      <div className="space-y-6">
        <ResultSummary />
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total repayment by salary
          </h3>
          <div className="h-[300px] sm:h-[400px] lg:h-[450px]">
            <TotalRepaymentChart />
          </div>
        </div>
      </div>

      <QuickInputs />

      <AdvancedConfigSection />
    </section>
  );
}
