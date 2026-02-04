"use client";

import CurrencyInput from "./CurrencyInput";
import PlanSelector from "./PlanSelector";
import { currencyFormatter } from "@/constants";
import { useLoanContext } from "@/context/LoanContext";
import {
  trackUndergradBalanceChanged,
  trackPostgradBalanceChanged,
} from "@/lib/analytics";
import { POSTGRADUATE_DISPLAY_INFO } from "@/lib/loans/plans";

export function AdvancedInputs() {
  const { state, updateField } = useLoanContext();
  const hasUndergrad = state.underGradBalance > 0;
  const hasPostgrad = state.postGradBalance > 0;

  return (
    <div className="space-y-6">
      {/* My Loans */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium tracking-wide uppercase">
          My Loans
        </h4>

        {/* Undergraduate Loan Card */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium tracking-wide uppercase">
              Undergraduate Loan
            </span>
            <div className="w-32">
              <CurrencyInput
                id="adv-undergrad-balance"
                value={state.underGradBalance}
                onChange={(value) => {
                  updateField("underGradBalance", value);
                }}
                onBlur={() => {
                  trackUndergradBalanceChanged(state.underGradBalance);
                }}
              />
            </div>
          </div>
          {!hasUndergrad && (
            <p className="mt-2 text-sm text-muted-foreground">
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
            <span className="text-sm font-medium tracking-wide uppercase">
              Postgraduate Loan
            </span>
            <div className="w-32">
              <CurrencyInput
                id="adv-postgrad-balance"
                value={state.postGradBalance}
                onChange={(value) => {
                  updateField("postGradBalance", value);
                }}
                onBlur={() => {
                  trackPostgradBalanceChanged(state.postGradBalance);
                }}
              />
            </div>
          </div>
          {!hasPostgrad && (
            <p className="mt-2 text-sm text-muted-foreground">
              Enter a balance if you have a postgraduate loan
            </p>
          )}
          {hasPostgrad && (
            <div className="mt-4 space-y-1.5 border-t pt-4 text-sm text-muted-foreground">
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
                  {String(POSTGRADUATE_DISPLAY_INFO.repaymentRate * 100)}% of
                  income above threshold
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
    </div>
  );
}

export default AdvancedInputs;
