"use client";

import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SALARY_GROWTH_OPTIONS, currencyFormatter } from "@/constants";
import { useAssumptionsWizard } from "@/context/AssumptionsWizardContext";
import {
  useLoanFrequentState,
  useLoanConfigState,
} from "@/context/LoanContext";
import { usePersonalizedResults } from "@/context/PersonalizedResultsContext";

export function SalaryGrowthBadge() {
  const { openAssumptions } = useAssumptionsWizard();
  const { salary } = useLoanFrequentState();
  const { salaryGrowthRate } = useLoanConfigState();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { summary } = usePersonalizedResults();

  const growthLabel =
    SALARY_GROWTH_OPTIONS.find((o) => o.value === salaryGrowthRate)?.label ??
    `${(salaryGrowthRate * 100).toFixed(0)}%`;

  const years = summary
    ? Math.max(1, Math.round(summary.monthsToPayoff / 12))
    : null;
  const projectedSalary =
    years !== null ? salary * Math.pow(1 + salaryGrowthRate, years) : null;

  return (
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
        <span className="text-xs text-muted-foreground">+{growthLabel}/yr</span>
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
        <Separator className="my-2" />
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
  );
}
