"use client";

import { Button } from "@/components/ui/button";
import { useLoanContext } from "@/context/LoanContext";
import { PRESETS } from "@/lib/presets";

export function PresetPills() {
  const { state, applyPreset } = useLoanContext();

  // Find matching preset based on loan configuration
  const activePreset = PRESETS.find(
    (p) =>
      p.underGradBalance === state.underGradBalance &&
      p.postGradBalance === state.postGradBalance &&
      p.underGradPlanType === state.underGradPlanType,
  );

  return (
    <div className="flex gap-1.5" role="group" aria-label="Preset profiles">
      {PRESETS.map((preset) => (
        <Button
          key={preset.id}
          variant={activePreset?.id === preset.id ? "default" : "outline"}
          size="xs"
          onClick={() => {
            applyPreset(preset);
          }}
          aria-pressed={activePreset?.id === preset.id}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
