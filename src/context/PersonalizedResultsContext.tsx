"use client";

import { createContext, use, type ReactNode } from "react";
import type { InsightCardsResult } from "@/types/insightCards";
import type { Insight } from "@/utils/insights";
import type {
  InsightSummary,
  InsightPayload,
} from "@/workers/simulation.worker";
import { useSimulationWorker } from "@/hooks/useSimulationWorker";
import {
  useLoanConfig,
  useCurrentSalary,
  useSalaryGrowthRate,
  useThresholdGrowthRate,
  useRpiRate,
  useBoeBaseRate,
  useActiveDiscountRate,
} from "@/hooks/useStoreSelectors";

interface PersonalizedResults {
  summary: InsightSummary | null;
  insight: Insight | null;
  cards: InsightCardsResult | null;
}

const PersonalizedResultsContext = createContext<PersonalizedResults>({
  summary: null,
  insight: null,
  cards: null,
});

export function PersonalizedResultsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const config = useLoanConfig();
  const salary = useCurrentSalary();
  const salaryGrowthRate = useSalaryGrowthRate();
  const thresholdGrowthRate = useThresholdGrowthRate();
  const rpiRate = useRpiRate();
  const boeBaseRate = useBoeBaseRate();
  const activeDiscountRate = useActiveDiscountRate();

  const payload: InsightPayload = {
    type: "INSIGHT",
    salary,
    loans: config.loans,
    salaryGrowthRate,
    thresholdGrowthRate,
    rpiRate,
    boeBaseRate,
    discountRate: activeDiscountRate,
  };

  const result = useSimulationWorker(payload);

  let summary = result?.summary ?? null;
  if (summary?.pvTotalPaid !== undefined) {
    summary = { ...summary, totalPaid: summary.pvTotalPaid };
  }

  const value: PersonalizedResults = {
    summary,
    insight: result?.insight ?? null,
    cards: result?.cards ?? null,
  };

  return (
    <PersonalizedResultsContext value={value}>
      {children}
    </PersonalizedResultsContext>
  );
}

export function usePersonalizedResults(): PersonalizedResults {
  return use(PersonalizedResultsContext);
}
