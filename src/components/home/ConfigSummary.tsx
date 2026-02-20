"use client";

import { PresetPills } from "./PresetPills";
import type { Preset } from "@/lib/presets";

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
