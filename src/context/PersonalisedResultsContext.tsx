"use client";

import { createContext, use, type ReactNode } from "react";
import { useSimulationWorker } from "@/hooks/useSimulationWorker";
import {
  useLoanConfig,
  useCurrentSalary,
  useSalaryGrowthRate,
  useThresholdGrowthRate,
  usePlan2ThresholdSchedule,
  useRpiRate,
  useBoeBaseRate,
  useActiveDiscountRate,
} from "@/hooks/useStoreSelectors";
import type { InsightCardsResult } from "@/types/insightCards";
import type { Insight } from "@/utils/insights";
import type {
  InsightSummary,
  InsightPayload,
} from "@/workers/simulation.worker";

interface PersonalisedResults {
  summary: InsightSummary | null;
  insight: Insight | null;
  cards: InsightCardsResult | null;
}

const PersonalisedResultsContext = createContext<PersonalisedResults>({
  summary: null,
  insight: null,
  cards: null,
});

export function PersonalisedResultsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const config = useLoanConfig();
  const salary = useCurrentSalary();
  const salaryGrowthRate = useSalaryGrowthRate();
  const thresholdGrowthRate = useThresholdGrowthRate();
  const plan2ThresholdSchedule = usePlan2ThresholdSchedule();
  const rpiRate = useRpiRate();
  const boeBaseRate = useBoeBaseRate();
  const activeDiscountRate = useActiveDiscountRate();

  const payload: InsightPayload = {
    type: "INSIGHT",
    salary,
    loans: config.loans,
    salaryGrowthRate,
    thresholdGrowthRate,
    plan2ThresholdSchedule,
    rpiRate,
    boeBaseRate,
    discountRate: activeDiscountRate,
  };

  const result = useSimulationWorker(payload);

  let summary = result?.summary ?? null;
  if (summary?.pvTotalPaid !== undefined) {
    summary = { ...summary, totalPaid: summary.pvTotalPaid };
  }

  const value: PersonalisedResults = {
    summary,
    insight: result?.insight ?? null,
    cards: result?.cards ?? null,
  };

  return (
    <PersonalisedResultsContext value={value}>
      {children}
    </PersonalisedResultsContext>
  );
}

export function usePersonalisedResults(): PersonalisedResults {
  return use(PersonalisedResultsContext);
}
