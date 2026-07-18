"use client";

import { useEffect } from "react";
import { Fold } from "@/components/home/instrument/Fold";
import { LeversSection } from "@/components/home/instrument/LeversSection";
import { RulesSection } from "@/components/home/instrument/RulesSection";
import { ToolsSection } from "@/components/home/instrument/ToolsSection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import type { InputMode } from "@/hooks/useInputPanelMode";
import { SHELL_MAX } from "@/lib/layout";
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
    <div className="flex min-h-dvh flex-col">
      <PlanFromQuery />
      <Header wide />
      <main
        id="main-content"
        className={`mx-auto w-full ${SHELL_MAX} flex-auto`}
      >
        <Fold initialMode={initialMode} />
        <RulesSection />
        <LeversSection />
        <ToolsSection />
      </main>
      <Footer wide />
    </div>
  );
}
