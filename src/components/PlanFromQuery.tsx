"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { useLoanActions } from "@/context/LoanContext";
import {
  trackSharedPlanLoaded,
  trackSharedUndergradBalanceLoaded,
  trackSharedPostgradBalanceLoaded,
  trackSharedSalaryLoaded,
  trackSharedMonthlyOverpaymentLoaded,
  trackSharedSalaryGrowthLoaded,
  trackSharedLumpSumLoaded,
  trackSharedRepaymentYearLoaded,
} from "@/lib/analytics";
import { decodeParamsToState } from "@/lib/shareUrl";

interface PlanFromQueryProps {
  onRepaymentYearChange?: (year: number) => void;
}

function PlanFromQueryInner({ onRepaymentYearChange }: PlanFromQueryProps) {
  const searchParams = useSearchParams();
  const { updateField } = useLoanActions();
  const lastAppliedParams = useRef<string>("");

  useEffect(() => {
    // Skip if we've already applied these exact params
    const paramsString = searchParams.toString();
    if (paramsString === lastAppliedParams.current) return;
    lastAppliedParams.current = paramsString;

    const decoded = decodeParamsToState(searchParams);

    if (decoded.underGradPlanType !== undefined) {
      trackSharedPlanLoaded(decoded.underGradPlanType);
      updateField("underGradPlanType", decoded.underGradPlanType);
    }
    if (decoded.underGradBalance !== undefined) {
      trackSharedUndergradBalanceLoaded(decoded.underGradBalance);
      updateField("underGradBalance", decoded.underGradBalance);
    }
    if (decoded.postGradBalance !== undefined) {
      trackSharedPostgradBalanceLoaded(decoded.postGradBalance);
      updateField("postGradBalance", decoded.postGradBalance);
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
    if (decoded.salaryGrowthRate !== undefined) {
      trackSharedSalaryGrowthLoaded(decoded.salaryGrowthRate);
      updateField("salaryGrowthRate", decoded.salaryGrowthRate);
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
