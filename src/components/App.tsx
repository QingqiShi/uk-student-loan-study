"use client";

import { useEffect } from "react";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import type { InputMode } from "@/hooks/useInputPanelMode";
import { HeroSection } from "./home/HeroSection";
import { InsightBadge, InsightCallout } from "./home/InsightCallout";
import { SalaryExplorer } from "./home/SalaryExplorer";
import { ToolLinks } from "./home/ToolLinks";
import { PageLayout } from "./layout/PageLayout";
import { AssumptionsCallout } from "./shared/AssumptionsCallout";
import { ControlBar } from "./shared/ControlBar";
import { InsightCards } from "./shared/InsightCards";
import { PlanFromQuery } from "./shared/PlanFromQuery";

export function App() {
  const { updateField } = useLoanActions();
  const config = useLoanConfigState();
  const { pendingQuizPlanTypes } = config;

  const initialMode: InputMode | undefined =
    pendingQuizPlanTypes && pendingQuizPlanTypes.length > 0
      ? { view: "loan-config", initialPlanTypes: pendingQuizPlanTypes }
      : undefined;

  useEffect(() => {
    if (pendingQuizPlanTypes && pendingQuizPlanTypes.length > 0) {
      updateField("pendingQuizPlanTypes", null);
    }
  }, [pendingQuizPlanTypes, updateField]);

  return (
    <>
      <PlanFromQuery />
      <PageLayout>
        <div className="space-y-3">
          <HeroSection />
          <InsightCallout />
          <SalaryExplorer badge={<InsightBadge />} />
        </div>

        <ControlBar initialMode={initialMode} />

        <InsightCards />

        <AssumptionsCallout />

        <ToolLinks />
      </PageLayout>
    </>
  );
}
