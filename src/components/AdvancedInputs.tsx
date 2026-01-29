"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLoanContext } from "@/context";
import CurrencyInput from "./CurrencyInput";
import DateInput from "./DateInput";

export function AdvancedInputs() {
  const { state, updateField } = useLoanContext();
  const isPost2023 = state.underGradPlanType === "PLAN_5";

  return (
    <div className="space-y-6">
      {/* Loan Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Loan Details</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <CurrencyInput
            id="adv-undergrad-balance"
            label="Undergraduate Loan Balance"
            value={state.underGradBalance}
            onChange={(value) => updateField("underGradBalance", value)}
          />
          <CurrencyInput
            id="adv-postgrad-balance"
            label="Postgraduate Loan Balance"
            value={state.postGradBalance}
            onChange={(value) => updateField("postGradBalance", value)}
          />
          <DateInput
            id="adv-repayment-date"
            label="Repayment Start Date"
            helperText="Determines when your loan is written off."
            value={state.repaymentDate}
            onChange={(value) => updateField("repaymentDate", value)}
          />
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
            checked={isPost2023}
            onCheckedChange={(checked) =>
              updateField("underGradPlanType", checked ? "PLAN_5" : "PLAN_2")
            }
          />
        </div>
      </div>
    </div>
  );
}

export default AdvancedInputs;
