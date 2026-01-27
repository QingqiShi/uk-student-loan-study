"use client";

import { lazy, Suspense } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/store";

const CurrencyInput = lazy(() => import("./CurrencyInput"));
const PercentageInput = lazy(() => import("./PercentageInput"));
const DateInput = lazy(() => import("./DateInput"));

export function AdvancedInputs() {
  const store = useStore();

  return (
    <div className="space-y-6">
      {/* Loan Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Loan Details</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <Suspense fallback={<Skeleton className="h-14 w-full" />}>
            <CurrencyInput
              id="adv-postgrad-balance"
              label="Postgraduate Loan Balance"
              value={store.postGradBalance}
              onChange={(value) => store.updateField("postGradBalance", value)}
            />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-14 w-full" />}>
            <DateInput
              id="adv-repayment-date"
              label="Repayment Start Date"
              helperText="Determines when your loan is written off."
              value={store.repaymentDate}
              onChange={(value) => store.updateField("repaymentDate", value)}
            />
          </Suspense>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="adv-post-2023">Plan 5 (Post-2023)</Label>
            <p className="text-muted-foreground text-sm">
              For students who started after August 2023. Has different
              thresholds and 40-year write-off.
            </p>
          </div>
          <Switch
            id="adv-post-2023"
            checked={store.isPost2023}
            onCheckedChange={(checked) =>
              store.updateField("isPost2023", checked)
            }
          />
        </div>
      </div>

      {/* Interest Rates */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Interest Rates</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          {!store.isPost2023 && (
            <>
              <Suspense fallback={<Skeleton className="h-14 w-full" />}>
                <PercentageInput
                  id="adv-plan2-lt-rate"
                  label="Plan 2 Lower Threshold Rate"
                  value={store.plan2LTRate}
                  onChange={(value) => store.updateField("plan2LTRate", value)}
                />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-14 w-full" />}>
                <PercentageInput
                  id="adv-plan2-ut-rate"
                  label="Plan 2 Upper Threshold Rate"
                  value={store.plan2UTRate}
                  onChange={(value) => store.updateField("plan2UTRate", value)}
                />
              </Suspense>
            </>
          )}
          {store.isPost2023 && (
            <Suspense fallback={<Skeleton className="h-14 w-full" />}>
              <PercentageInput
                id="adv-plan5-rate"
                label="Plan 5 Interest Rate (RPI)"
                value={store.plan5Rate}
                onChange={(value) => store.updateField("plan5Rate", value)}
              />
            </Suspense>
          )}
          <Suspense fallback={<Skeleton className="h-14 w-full" />}>
            <PercentageInput
              id="adv-postgrad-rate"
              label="Postgraduate Rate"
              value={store.postGradRate}
              onChange={(value) => store.updateField("postGradRate", value)}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default AdvancedInputs;
