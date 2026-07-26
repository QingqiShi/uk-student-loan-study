"use client";

import { startTransition, useOptimistic } from "react";
import { Figure } from "@/components/typography/Figure";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  MIN_MONTHLY_OVERPAYMENT,
  MAX_MONTHLY_OVERPAYMENT,
  OVERPAYMENT_STEP,
  currencyFormatter,
} from "@/constants";
import { useLoanActions, useLoanFrequentState } from "@/context/LoanContext";
import { useLoanConfig } from "@/hooks/useStoreSelectors";
import {
  trackOverpayMonthlyChanged,
  trackOverpayLumpsumChanged,
} from "@/lib/analytics";
import { ENGRAVED_LABEL } from "@/lib/layout";

/**
 * The overpayment you are proposing — flat on the paper rather than boxed in a
 * panel, sitting with the verdict it changes. Each lever is an engraved key with
 * its live mono figure on the right, so the two read as one console rather than
 * two fields.
 *
 * Only the two overpayment levers live here; the repayment start year is a fact
 * about the loan, not a choice about overpaying, so it sits with the income and
 * balance in the situation section. That keeps the fold to the one decision the
 * page exists to make — and keeps it short enough to read on a phone.
 *
 * It runs as a single column in the rail, where the slider gets the rail's full
 * width; only in the band between `sm` and `wide`, where the console spans the
 * page, does it split two-up.
 */
export function OverpayControls() {
  const { updateField } = useLoanActions();
  const { monthlyOverpayment, lumpSumPayment } = useLoanFrequentState();
  const { underGradBalance, postGradBalance } = useLoanConfig();
  const totalBalance = underGradBalance + postGradBalance;
  const [optimisticOverpayment, setOptimisticOverpayment] =
    useOptimistic(monthlyOverpayment);
  const [optimisticLumpSum, setOptimisticLumpSum] =
    useOptimistic(lumpSumPayment);

  const handleOverpaymentChange = (value: number | readonly number[]) => {
    const newValue = typeof value === "number" ? value : value[0];
    startTransition(() => {
      setOptimisticOverpayment(newValue);
      updateField("monthlyOverpayment", newValue);
    });
  };

  const handleLumpSumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = value === "" ? 0 : parseInt(value, 10);
    const clampedValue = Math.min(Math.max(0, numValue), totalBalance);
    startTransition(() => {
      setOptimisticLumpSum(clampedValue);
      updateField("lumpSumPayment", clampedValue);
    });
  };

  return (
    <div
      data-slot="overpay-controls"
      className="grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-6 sm:grid-cols-2 sm:items-start wide:grid-cols-1"
    >
      {/* Lump sum */}
      <div className="flex flex-col gap-[0.6rem]">
        {/* Both key rails are floored to the same height and bottom-aligned, so
            the two engraved keys land on one line when the console runs two-up.
            Baseline alignment would not do it: each rail's baseline is set by
            its own tallest item, and the two rails carry different figures. */}
        <div className="flex min-h-7 items-end gap-[0.6rem]">
          <Label htmlFor="lump-sum-input" className={ENGRAVED_LABEL}>
            Lump sum
          </Label>
          {totalBalance > 0 && (
            <span
              id="lump-sum-max"
              className="ml-auto font-sans text-meta text-muted-foreground"
            >
              Max{" "}
              <Figure className="text-foreground">
                {currencyFormatter.format(totalBalance)}
              </Figure>
            </span>
          )}
        </div>
        {totalBalance > 0 ? (
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-faint">
              £
            </span>
            <Input
              id="lump-sum-input"
              type="text"
              inputMode="numeric"
              value={
                optimisticLumpSum === 0
                  ? ""
                  : optimisticLumpSum.toLocaleString("en-GB")
              }
              onChange={handleLumpSumChange}
              onBlur={() => {
                trackOverpayLumpsumChanged(lumpSumPayment);
              }}
              placeholder="0"
              className="pl-6 font-mono tabular-nums"
              aria-label="Enter one-off lump sum payment"
              aria-describedby="lump-sum-max"
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Configure your loan balance first
          </p>
        )}
      </div>

      {/* Monthly overpayment */}
      <div className="flex min-w-0 flex-col gap-[0.6rem]">
        <div className="flex min-h-7 items-end gap-[0.6rem]">
          <Label htmlFor="overpayment-slider" className={ENGRAVED_LABEL}>
            Monthly overpayment
          </Label>
          <span className="ml-auto font-mono text-fig-md font-semibold tracking-[-0.015em] tabular-nums">
            <Figure value={currencyFormatter.format(optimisticOverpayment)} />
          </span>
        </div>
        <Slider
          id="overpayment-slider"
          value={[optimisticOverpayment]}
          onValueChange={handleOverpaymentChange}
          onValueCommitted={(value) => {
            const overpayValue = typeof value === "number" ? value : value[0];
            trackOverpayMonthlyChanged(overpayValue);
          }}
          min={MIN_MONTHLY_OVERPAYMENT}
          max={MAX_MONTHLY_OVERPAYMENT}
          step={OVERPAYMENT_STEP}
          aria-label="Adjust monthly overpayment amount"
        />
        <div className="flex justify-between font-sans text-meta text-muted-foreground">
          <Figure>{currencyFormatter.format(MIN_MONTHLY_OVERPAYMENT)}</Figure>
          <Figure>{currencyFormatter.format(MAX_MONTHLY_OVERPAYMENT)}</Figure>
        </div>
      </div>
    </div>
  );
}
