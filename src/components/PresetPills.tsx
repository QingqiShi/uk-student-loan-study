"use client";

import { Button } from "@/components/ui/button";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import { trackPresetApplied } from "@/lib/analytics";
import { PRESETS } from "@/lib/presets";

export function PresetPills() {
  const { applyPreset } = useLoanActions();
  const config = useLoanConfigState();

  // Find matching preset based on loan configuration
  const activePreset = PRESETS.find(
    (p) =>
      p.underGradBalance === config.underGradBalance &&
      p.postGradBalance === config.postGradBalance &&
      p.underGradPlanType === config.underGradPlanType,
  );

  return (
    <div className="flex gap-1.5" role="group" aria-label="Preset profiles">
      {PRESETS.map((preset) => (
        <Button
          key={preset.id}
          variant={activePreset?.id === preset.id ? "default" : "outline"}
          size="xs"
          onClick={() => {
            trackPresetApplied(preset.id);
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
