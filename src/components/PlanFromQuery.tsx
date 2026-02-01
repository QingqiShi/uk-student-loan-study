"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import type { UndergraduatePlanType } from "@/lib/loans/types";
import { useLoanContext } from "@/context/LoanContext";

const VALID_PLANS: UndergraduatePlanType[] = [
  "PLAN_1",
  "PLAN_2",
  "PLAN_4",
  "PLAN_5",
];

function isValidPlan(plan: string): plan is UndergraduatePlanType {
  return VALID_PLANS.includes(plan as UndergraduatePlanType);
}

function PlanFromQueryInner() {
  const searchParams = useSearchParams();
  const { updateField } = useLoanContext();

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam && isValidPlan(planParam)) {
      updateField("underGradPlanType", planParam);
    }
  }, [searchParams, updateField]);

  return null;
}

export function PlanFromQuery() {
  return (
    <Suspense fallback={null}>
      <PlanFromQueryInner />
    </Suspense>
  );
}
