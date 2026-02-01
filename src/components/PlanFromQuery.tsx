"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { useLoanContext } from "@/context/LoanContext";
import { decodeParamsToState } from "@/lib/shareUrl";

interface PlanFromQueryProps {
  onRepaymentYearChange?: (year: number) => void;
}

function PlanFromQueryInner({ onRepaymentYearChange }: PlanFromQueryProps) {
  const searchParams = useSearchParams();
  const { updateField } = useLoanContext();
  const lastAppliedParams = useRef<string>("");

  useEffect(() => {
    // Skip if we've already applied these exact params
    const paramsString = searchParams.toString();
    if (paramsString === lastAppliedParams.current) return;
    lastAppliedParams.current = paramsString;

    const decoded = decodeParamsToState(searchParams);

    if (decoded.underGradPlanType !== undefined) {
      updateField("underGradPlanType", decoded.underGradPlanType);
    }
    if (decoded.underGradBalance !== undefined) {
      updateField("underGradBalance", decoded.underGradBalance);
    }
    if (decoded.postGradBalance !== undefined) {
      updateField("postGradBalance", decoded.postGradBalance);
    }
    if (decoded.salary !== undefined) {
      updateField("salary", decoded.salary);
    }

    // Overpay-specific fields
    if (decoded.monthlyOverpayment !== undefined) {
      updateField("monthlyOverpayment", decoded.monthlyOverpayment);
    }
    if (decoded.salaryGrowthRate !== undefined) {
      updateField("salaryGrowthRate", decoded.salaryGrowthRate);
    }
    if (decoded.lumpSumPayment !== undefined) {
      updateField("lumpSumPayment", decoded.lumpSumPayment);
    }
    if (decoded.repaymentYear !== undefined && onRepaymentYearChange) {
      onRepaymentYearChange(decoded.repaymentYear);
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
