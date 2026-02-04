"use client";

import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import type { UndergraduatePlanType } from "@/lib/loans/types";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { currencyFormatter } from "@/constants";
import { useLoanContext } from "@/context/LoanContext";
import { trackPlanSelected, trackPlanInfoViewed } from "@/lib/analytics";
import { PLAN_DISPLAY_INFO } from "@/lib/loans/plans";

const PLAN_TYPES: UndergraduatePlanType[] = [
  "PLAN_1",
  "PLAN_2",
  "PLAN_4",
  "PLAN_5",
];

export function PlanSelector() {
  const { state, updateField } = useLoanContext();
  const selectedPlan = state.underGradPlanType;
  const selectedInfo = PLAN_DISPLAY_INFO[selectedPlan];

  return (
    <div className="space-y-3">
      {/* Compact button group */}
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Select loan plan"
      >
        {PLAN_TYPES.map((planType) => {
          const info = PLAN_DISPLAY_INFO[planType];
          const isSelected = selectedPlan === planType;

          return (
            <Button
              key={planType}
              type="button"
              role="radio"
              aria-checked={isSelected}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => {
                trackPlanSelected(planType);
                updateField("underGradPlanType", planType);
              }}
            >
              {info.name}
            </Button>
          );
        })}
      </div>

      {/* Summary line with info popover */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>
          {selectedInfo.region} •{" "}
          {currencyFormatter.format(selectedInfo.yearlyThreshold)}/year
          threshold • {selectedInfo.writeOffYears}yr write-off
        </span>
        <Popover
          onOpenChange={(open) => {
            if (open) {
              trackPlanInfoViewed(selectedPlan);
            }
          }}
        >
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-foreground"
                aria-label="More information about this plan"
              >
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  className="size-4"
                />
              </Button>
            }
          />
          <PopoverContent align="start" className="w-80">
            <PopoverHeader>
              <PopoverTitle>{selectedInfo.name}</PopoverTitle>
              <PopoverDescription>
                {selectedInfo.region} • {selectedInfo.years}
              </PopoverDescription>
            </PopoverHeader>
            <p className="text-sm">{selectedInfo.description}</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Threshold</span>
                <span>
                  {currencyFormatter.format(selectedInfo.yearlyThreshold)}/year
                </span>
              </div>
              <div className="flex justify-between">
                <span>Repayment</span>
                <span>
                  {String(selectedInfo.repaymentRate * 100)}% of income above
                  threshold
                </span>
              </div>
              <div className="flex justify-between">
                <span>Write-off</span>
                <span>{selectedInfo.writeOffYears} years</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <span className="text-muted-foreground/50">•</span>
        <Link
          href="/which-plan?ref=plan-selector"
          className="text-primary underline-offset-4 hover:underline"
        >
          Not sure?
        </Link>
      </div>
    </div>
  );
}

export default PlanSelector;
