"use client";

import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { TotalRepaymentChart } from "./TotalRepaymentChart";
import { Slider } from "./ui/slider";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  MIN_SALARY,
  MAX_SALARY,
  SALARY_STEP,
  SALARY_GROWTH_OPTIONS,
  currencyFormatter,
} from "@/constants";
import { useAssumptionsWizard } from "@/context/AssumptionsWizardContext";
import {
  useLoanFrequentState,
  useLoanConfigState,
  useLoanActions,
} from "@/context/LoanContext";
import { useResultSummary } from "@/hooks/useResultSummary";
import { trackSalaryChanged } from "@/lib/analytics";

export function SalaryExplorer() {
  const { openAssumptions } = useAssumptionsWizard();
  const { salary } = useLoanFrequentState();
  const { salaryGrowthRate } = useLoanConfigState();
  const { updateField } = useLoanActions();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const summary = useResultSummary();

  const growthLabel =
    SALARY_GROWTH_OPTIONS.find((o) => o.value === salaryGrowthRate)?.label ??
    `${(salaryGrowthRate * 100).toFixed(0)}%`;

  const years = summary
    ? Math.max(1, Math.round(summary.monthsToPayoff / 12))
    : null;
  const projectedSalary =
    years !== null ? salary * Math.pow(1 + salaryGrowthRate, years) : null;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Total repayment
        </h3>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger
            openOnHover
            delay={200}
            closeDelay={200}
            render={
              <button
                type="button"
                className="flex items-center gap-1 rounded-md text-sm text-muted-foreground hover:text-foreground"
                aria-label="Salary growth info"
              />
            }
          >
            Your salary:{" "}
            <span className="font-mono font-semibold text-foreground tabular-nums">
              {currencyFormatter.format(salary)}
            </span>
            <span className="text-xs text-muted-foreground/70">
              +{growthLabel}/yr
            </span>
            <HugeiconsIcon icon={InformationCircleIcon} className="size-4" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-3">
            <p className="text-sm text-muted-foreground">
              This is your starting annual salary. We assume it grows by{" "}
              <span className="font-medium text-foreground">{growthLabel}</span>{" "}
              each year
              {salaryGrowthRate > 0 &&
              projectedSalary !== null &&
              years !== null ? (
                <>
                  , reaching{" "}
                  <span className="font-medium text-foreground">
                    {currencyFormatter.format(Math.round(projectedSalary))}
                  </span>{" "}
                  after {years} {years === 1 ? "year" : "years"}
                </>
              ) : null}
              .
            </p>
            <div className="my-2 h-px bg-border" />
            <button
              type="button"
              onClick={() => {
                setPopoverOpen(false);
                openAssumptions();
              }}
              className="w-full rounded-md px-2 py-1.5 text-left text-sm text-primary hover:bg-accent"
            >
              Update growth assumption &rarr;
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="h-[300px] sm:h-[400px] lg:h-[450px]">
        <TotalRepaymentChart />
      </div>

      {/* Padding aligns slider track with chart plot area (25px margin + ~60px YAxis) */}
      <div className="-mt-1 pr-[25px] pl-[85px]">
        <Slider
          value={salary}
          min={MIN_SALARY}
          max={MAX_SALARY}
          step={SALARY_STEP}
          onValueChange={(value) => {
            const v = typeof value === "number" ? value : value[0];
            updateField("salary", v);
          }}
          onValueCommitted={(value) => {
            const v = typeof value === "number" ? value : value[0];
            trackSalaryChanged(v);
          }}
          aria-label="Adjust your annual salary"
        />
      </div>
    </div>
  );
}
