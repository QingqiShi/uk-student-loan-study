"use client";

import type { Preset } from "@/lib/presets";
import { PresetPills } from "@/components/PresetPills";

interface ConfigSummaryProps {
  hasPersonalized: boolean;
  onPersonalise: () => void;
  onPresetApplied: (preset: Preset) => void;
}

export function ConfigSummary({
  hasPersonalized,
  onPersonalise,
  onPresetApplied,
}: ConfigSummaryProps) {
  return (
    <PresetPills
      hasPersonalized={hasPersonalized}
      onPresetApplied={onPresetApplied}
      onPersonalise={onPersonalise}
    />
  );
}
