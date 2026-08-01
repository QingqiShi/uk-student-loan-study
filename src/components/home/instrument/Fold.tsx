"use client";

import type { InputMode } from "@/hooks/useInputPanelMode";
import { useInputPanelMode } from "@/hooks/useInputPanelMode";
import { FOLD_PAD, FOLD_WORKSPACE, SHELL_GUTTER } from "@/lib/layout";
import { ChartPanel } from "./ChartPanel";
import { Controls } from "./Controls";
import { Hero } from "./Hero";
import { Readout } from "./Readout";

export function Fold({ initialMode }: { initialMode?: InputMode }) {
  const {
    mode,
    hasPersonalised,
    handlePersonalise,
    handlePresetApplied,
    handleWizardComplete,
    handleWizardClose,
  } = useInputPanelMode({ initialMode });

  return (
    <section
      className={`${SHELL_GUTTER} ${FOLD_PAD}`}
      aria-label="Repayment explorer"
    >
      <div className={FOLD_WORKSPACE}>
        <Hero />
        <ChartPanel />
        <Readout onTailor={handlePersonalise} />
        <Controls
          mode={mode}
          hasPersonalised={hasPersonalised}
          handlePersonalise={handlePersonalise}
          handlePresetApplied={handlePresetApplied}
          handleWizardComplete={handleWizardComplete}
          handleWizardClose={handleWizardClose}
        />
      </div>
    </section>
  );
}
