"use client";

import { useAssumptionsWizard } from "@/context/AssumptionsWizardContext";

export function AssumptionsCallout() {
  const { openAssumptions } = useAssumptionsWizard();

  return (
    <p className="text-center text-xs text-muted-foreground">
      These projections use assumptions about salary growth, inflation, and
      interest rates.{" "}
      <button
        type="button"
        className="cursor-pointer text-primary underline underline-offset-2 hover:text-primary/80"
        onClick={() => {
          openAssumptions();
        }}
      >
        See or change assumptions
      </button>
    </p>
  );
}
