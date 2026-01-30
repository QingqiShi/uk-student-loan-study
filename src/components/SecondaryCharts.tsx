"use client";

import InterestRateChart from "./InterestRateChart";
import RepaymentYearsChart from "./RepaymentYearsChart";

export function SecondaryCharts() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-base font-semibold">How Long Will It Take?</h3>
        <p className="text-muted-foreground text-sm">
          Low earners pay for the full 30 years until write-off. See how quickly
          repayment time drops as salary increases—a small pay rise can save
          years of payments.
        </p>
        <div className="h-[300px] sm:h-[350px]">
          <RepaymentYearsChart />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold">Effective Interest Rate</h3>
        <p className="text-muted-foreground text-sm">
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
