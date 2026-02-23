"use client";

import { Field } from "@base-ui/react/field";
import { startTransition, useOptimistic } from "react";
import { Switch } from "@/components/ui/switch";
import { useAssumptionsWizard } from "@/context/AssumptionsWizardContext";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";

function RateLink({
  discountLabel,
  onOpen,
  tabIndex,
}: {
  discountLabel: string;
  onOpen: () => void;
  tabIndex?: number;
}) {
  return (
    <button
      type="button"
      tabIndex={tabIndex}
      className="cursor-pointer text-xs whitespace-nowrap text-primary hover:underline"
      onClick={onOpen}
    >
      {discountLabel}/yr
    </button>
  );
}

export function PresentValueToggle() {
  const { showPresentValue, discountRate } = useLoanConfigState();
  const { updateField } = useLoanActions();
  const { openAssumptions } = useAssumptionsWizard();
  const [optimisticShowPresentValue, setOptimisticShowPresentValue] =
    useOptimistic(showPresentValue);

  const discountLabel = `${(discountRate * 100).toFixed(0)}%`;

  const handleOpenRate = () => {
    openAssumptions("discount-rate");
  };

  return (
    <Field.Root>
      <div
        className={`flex items-center rounded-lg px-2 py-1 transition-colors ${
          optimisticShowPresentValue ? "bg-primary/5 dark:bg-primary/10" : ""
        }`}
      >
        {/* Desktop: rate slides in to the left of the switch */}
        <div
          className={`hidden overflow-hidden motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out sm:block ${
            optimisticShowPresentValue
              ? "max-w-20 opacity-100"
              : "max-w-0 opacity-0"
          }`}
        >
          <span className="flex items-center pr-2">
            <RateLink
              discountLabel={discountLabel}
              onOpen={handleOpenRate}
              tabIndex={optimisticShowPresentValue ? 0 : -1}
            />
            <span className="pl-1 text-xs text-muted-foreground">&middot;</span>
          </span>
        </div>
        <Switch
          size="sm"
          checked={optimisticShowPresentValue}
          onCheckedChange={(checked) => {
            startTransition(() => {
              setOptimisticShowPresentValue(checked);
              updateField("showPresentValue", checked);
            });
          }}
        />
        <Field.Label className="flex-1 cursor-pointer pl-1.5 text-xs text-muted-foreground">
          Adjust for inflation
        </Field.Label>
        {/* Mobile: rate appears on the far right */}
        <div
          className={`overflow-hidden motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out sm:hidden ${
            optimisticShowPresentValue
              ? "max-w-20 opacity-100"
              : "max-w-0 opacity-0"
          }`}
        >
          <span className="flex items-center pl-2">
            <span className="pr-1 text-xs text-muted-foreground">&middot;</span>
            <RateLink
              discountLabel={discountLabel}
              onOpen={handleOpenRate}
              tabIndex={optimisticShowPresentValue ? 0 : -1}
            />
          </span>
        </div>
      </div>
    </Field.Root>
  );
}
