"use client";

import CurrencyInput from "./CurrencyInput";
import PlanSelector from "./PlanSelector";
import YearSelector from "./YearSelector";
import { currencyFormatter } from "@/constants";
import { useLoanContext } from "@/context";
import { POSTGRADUATE_DISPLAY_INFO } from "@/lib/loans";

export function AdvancedInputs() {
  const { state, updateField } = useLoanContext();
  const hasUndergrad = state.underGradBalance > 0;
  const hasPostgrad = state.postGradBalance > 0;

  return (
    <div className="space-y-6">
      {/* My Loans */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium uppercase tracking-wide">
          My Loans
        </h4>

        {/* Undergraduate Loan Card */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium uppercase tracking-wide">
              Undergraduate Loan
            </span>
            <div className="w-32">
              <CurrencyInput
                id="adv-undergrad-balance"
                value={state.underGradBalance}
                onChange={(value) => {
                  updateField("underGradBalance", value);
                }}
              />
            </div>
          </div>
          {!hasUndergrad && (
            <p className="text-muted-foreground mt-2 text-sm">
              Enter a balance if you have an undergraduate loan
            </p>
          )}
          {hasUndergrad && (
            <div className="mt-4 border-t pt-4">
              <PlanSelector />
            </div>
          )}
        </div>

        {/* Postgraduate Loan Card */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium uppercase tracking-wide">
              Postgraduate Loan
            </span>
            <div className="w-32">
              <CurrencyInput
                id="adv-postgrad-balance"
                value={state.postGradBalance}
                onChange={(value) => {
                  updateField("postGradBalance", value);
                }}
              />
            </div>
          </div>
          {!hasPostgrad && (
            <p className="text-muted-foreground mt-2 text-sm">
              Enter a balance if you have a postgraduate loan
            </p>
          )}
          {hasPostgrad && (
            <div className="text-muted-foreground mt-4 space-y-1.5 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span>Threshold</span>
                <span>
                  {currencyFormatter.format(
                    POSTGRADUATE_DISPLAY_INFO.yearlyThreshold,
                  )}
                  /year
                </span>
              </div>
              <div className="flex justify-between">
                <span>Repayment</span>
                <span>
                  {POSTGRADUATE_DISPLAY_INFO.repaymentRate} of income above
                  threshold
                </span>
              </div>
              <div className="flex justify-between">
                <span>Write-off</span>
                <span>{POSTGRADUATE_DISPLAY_INFO.writeOffYears} years</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Repayment Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium uppercase tracking-wide">
          Repayment Details
        </h4>
        <YearSelector
          id="adv-repayment-year"
          label="Repayment Start Year"
          helperText="Determines when your loan is written off."
          value={state.repaymentDate}
          onChange={(value) => {
            updateField("repaymentDate", value);
          }}
        />
      </div>
    </div>
  );
}

export default AdvancedInputs;
