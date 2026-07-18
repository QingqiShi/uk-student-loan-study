"use client";

import type { InputMode } from "@/hooks/useInputPanelMode";
import { useInputPanelMode } from "@/hooks/useInputPanelMode";
import { SHELL_GUTTER } from "@/lib/layout";
import { ChartPanel } from "./ChartPanel";
import { Controls } from "./Controls";
import { Hero } from "./Hero";
import { Readout } from "./Readout";

export function Fold({ initialMode }: { initialMode?: InputMode }) {
  const {
    mode,
    hasPersonalized,
    handlePersonalise,
    handlePresetApplied,
    handleWizardComplete,
    handleWizardClose,
  } = useInputPanelMode({ initialMode });

  return (
    <section
      className={`${SHELL_GUTTER} pt-[clamp(1.8rem,3.2vw,3rem)] pb-[clamp(2.2rem,4vw,4rem)]`}
      aria-label="Repayment explorer"
    >
      <div className="grid grid-cols-[1fr] gap-[clamp(1.1rem,2vw,1.7rem)] [grid-template-areas:'head'_'chart'_'controls'_'readout'] *:min-w-0 md:grid-cols-[minmax(300px,0.82fr)_1.18fr] md:items-center md:gap-[clamp(1.4rem,2.2vw,2rem)] md:[grid-template-areas:'head_chart'_'readout_readout'_'controls_controls'] work:grid-cols-[36ch_minmax(0,1fr)_33ch] work:grid-rows-[auto_1fr] work:items-start work:gap-x-[clamp(2.4rem,3vw,4rem)] work:gap-y-[clamp(1.4rem,1.6vw,2rem)] work:[grid-template-areas:'head_chart_readout'_'controls_chart_readout'] ultra:grid-cols-[40ch_minmax(0,1fr)_38ch]">
        <Hero />
        <ChartPanel />
        <Readout onTailor={handlePersonalise} />
        <Controls
          mode={mode}
          hasPersonalized={hasPersonalized}
          handlePersonalise={handlePersonalise}
          handlePresetApplied={handlePresetApplied}
          handleWizardComplete={handleWizardComplete}
          handleWizardClose={handleWizardClose}
        />
      </div>
    </section>
  );
}
