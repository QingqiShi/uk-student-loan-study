"use client";

import { SALARY_GROWTH_OPTIONS } from "@/constants";
import { useAssumptionsWizard } from "@/context/AssumptionsWizardContext";
import { useLoanConfigState } from "@/context/LoanContext";

export function AssumptionsCallout() {
  const { openAssumptions } = useAssumptionsWizard();
  const config = useLoanConfigState();

  const salaryLabel =
    SALARY_GROWTH_OPTIONS.find((o) => o.value === config.salaryGrowthRate)
      ?.label ?? `${(config.salaryGrowthRate * 100).toFixed(0)}%`;

  const thresholdLabel =
    config.thresholdGrowthRate === 0
      ? "frozen"
      : `+${(config.thresholdGrowthRate * 100).toFixed(0)}%/yr`;

  const rpiLabel = `${config.rpiRate % 1 === 0 ? config.rpiRate.toFixed(0) : config.rpiRate.toFixed(1)}%`;

  const showBoe = config.loans.some(
    (l) => l.planType === "PLAN_1" || l.planType === "PLAN_4",
  );

  const boeLabel = `${config.boeBaseRate % 1 === 0 ? config.boeBaseRate.toFixed(0) : config.boeBaseRate.toFixed(2)}%`;

  const discountLabel = `${(config.discountRate * 100).toFixed(0)}%`;

  const hasTrailingItem = showBoe || config.showPresentValue;

  const bold = "font-medium text-foreground";

  return (
    <p className="text-center text-xs text-muted-foreground">
      Based on <span className={bold}>{salaryLabel}</span> salary growth,{" "}
      <span className={bold}>{thresholdLabel}</span> thresholds,
      {hasTrailingItem ? " " : " and "}
      <span className={bold}>{rpiLabel}</span> RPI
      {showBoe && (
        <>
          ,{config.showPresentValue ? " " : " and "}
          <span className={bold}>{boeLabel}</span> base rate
        </>
      )}
      {config.showPresentValue && (
        <>
          , adjusted for <span className={bold}>{discountLabel}</span> inflation
        </>
      )}
      .{" "}
      <button
        type="button"
        className="cursor-pointer text-primary underline underline-offset-2 hover:text-primary/80"
        onClick={() => {
          openAssumptions();
        }}
      >
        Change assumptions
      </button>
    </p>
  );
}
