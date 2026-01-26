import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const InterestRateChart = lazy(() => import("./InterestRateChart"));
const RepaymentYearsChart = lazy(() => import("./RepaymentYearsChart"));
const TotalRepaymentChart = lazy(() => import("./TotalRepaymentChart"));

export function ChartsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-[repeat(auto-fill,minmax(600px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(700px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(800px,1fr))]">
      <div className="flex flex-col p-4 lg:p-8">
        <div className="flex-grow">
          <h2 className="text-lg font-bold">How much do you repay in total?</h2>
          <p className="text-muted-foreground">
            Low income earners usually get the best deal because their student
            loan is written off after 30 years of repayment, and as a result
            never pay back the full amount of their loan. Higher income earners
            usually pay back their loans with small amounts of interest, because
            they are able to repay quickly so interest don&apos;t have much time
            to accumulate. Middle income earners around the peak of the
            following chart should really look into either increasing their
            salaries quickly, or make additional payments to reduce the total
            amount they&apos;ll have to pay back.
          </p>
        </div>
        <div className="h-[300px] sm:h-[400px] lg:h-[450px] lg:p-4 xl:h-[600px]">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <TotalRepaymentChart />
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col p-4 lg:p-8">
        <div className="flex-grow">
          <h2 className="text-lg font-bold">
            How long does it take to pay off your student loan?
          </h2>
          <p className="text-muted-foreground">
            Low income earners usually pay for the full 30 years until their
            student loan is written off. You can observer in the following chart
            how quickly the time required to pay off your student loan reduces
            as the salary increases. It might make sense to make additional
            payments if your salary is at the steepest part of the chart,
            because a small amount can potentially reduce your repayment by many
            years.
          </p>
        </div>
        <div className="h-[300px] sm:h-[400px] lg:h-[450px] lg:p-4 xl:h-[600px]">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <RepaymentYearsChart />
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col p-4 lg:p-8">
        <div className="flex-grow">
          <h2 className="text-lg font-bold">
            Is it worth paying off student loan early?
          </h2>
          <p className="text-muted-foreground">
            You can use the chart below to see what the effective annualized
            interest rate is for different levels of income. You&apos;ll notice
            that the value is lower than the officially stated interest rate,
            this is because as you pay down your student loan you incur less
            interest which reduces the overall interest rate. In conclusion, if
            you believe you can make a better return somewhere else, such as the
            stock market or in real estate, then you will be financially better
            off to invest than to pay down your student loan early.
          </p>
        </div>
        <div className="h-[300px] sm:h-[400px] lg:h-[450px] lg:p-4 xl:h-[600px]">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <InterestRateChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
