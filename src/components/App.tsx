"use client";

import { useEffect } from "react";
import { Fold } from "@/components/home/instrument/Fold";
import { LeversSection } from "@/components/home/instrument/LeversSection";
import { RulesSection } from "@/components/home/instrument/RulesSection";
import { ToolsSection } from "@/components/home/instrument/ToolsSection";
import { WideLayout } from "@/components/layout/WideLayout";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import type { InputMode } from "@/hooks/useInputPanelMode";
import { PlanFromQuery } from "./shared/PlanFromQuery";

export function App() {
  const { updateField } = useLoanActions();
  const { pendingQuizPlanTypes } = useLoanConfigState();

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
    <WideLayout>
      <PlanFromQuery />
      <Fold initialMode={initialMode} />
      <RulesSection />
      <LeversSection />
      <ToolsSection />
    </WideLayout>
  );
}
