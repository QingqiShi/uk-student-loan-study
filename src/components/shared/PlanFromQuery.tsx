"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { useLoanActions } from "@/context/LoanContext";
import {
  trackSharedLoansLoaded,
  trackSharedSalaryLoaded,
  trackSharedMonthlyOverpaymentLoaded,
  trackSharedAssumptionLoaded,
  trackSharedLumpSumLoaded,
  trackSharedRepaymentYearLoaded,
} from "@/lib/analytics";
import { decodeParamsToState, ASSUMPTION_PARAMS } from "@/lib/shareUrl";

interface PlanFromQueryProps {
  onRepaymentYearChange?: (year: number) => void;
}

function PlanFromQueryInner({ onRepaymentYearChange }: PlanFromQueryProps) {
  const searchParams = useSearchParams();
  const { updateField } = useLoanActions();
  const lastAppliedParamsRef = useRef<string>("");

  useEffect(() => {
    // Skip if we've already applied these exact params
    const paramsString = searchParams.toString();
    if (paramsString === lastAppliedParamsRef.current) return;
    lastAppliedParamsRef.current = paramsString;

    const decoded = decodeParamsToState(searchParams);

    if (decoded.loans !== undefined) {
      trackSharedLoansLoaded(decoded.loans);
      updateField("loans", decoded.loans);
    }
    if (decoded.salary !== undefined) {
      trackSharedSalaryLoaded(decoded.salary);
      updateField("salary", decoded.salary);
    }

    // Overpay-specific fields
    if (decoded.monthlyOverpayment !== undefined) {
      trackSharedMonthlyOverpaymentLoaded(decoded.monthlyOverpayment);
      updateField("monthlyOverpayment", decoded.monthlyOverpayment);
    }
    for (const field of ASSUMPTION_PARAMS) {
      const value = decoded[field.stateKey];
      if (value !== undefined) {
        trackSharedAssumptionLoaded(field.analyticsName, value);
        updateField(field.stateKey, value);
      }
    }
    if (decoded.applyPlan2Freeze !== undefined) {
      updateField("applyPlan2Freeze", decoded.applyPlan2Freeze);
    }
    if (decoded.showPresentValue) {
      updateField("showPresentValue", true);
    }
    if (decoded.lumpSumPayment !== undefined) {
      trackSharedLumpSumLoaded(decoded.lumpSumPayment);
      updateField("lumpSumPayment", decoded.lumpSumPayment);
    }
    if (decoded.repaymentYear !== undefined) {
      trackSharedRepaymentYearLoaded(decoded.repaymentYear);
      if (onRepaymentYearChange) {
        onRepaymentYearChange(decoded.repaymentYear);
      }
    }
  }, [searchParams, updateField, onRepaymentYearChange]);

  return null;
}

export function PlanFromQuery({ onRepaymentYearChange }: PlanFromQueryProps) {
  return (
    <Suspense fallback={null}>
      <PlanFromQueryInner onRepaymentYearChange={onRepaymentYearChange} />
    </Suspense>
  );
}
