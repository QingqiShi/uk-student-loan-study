"use client";

import { PreferenceHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PresentValueToggle } from "./PresentValueToggle";
import type { Preset } from "@/lib/presets";
import { useLoanConfigState } from "@/context/LoanContext";
import { PRESETS } from "@/lib/presets";
import { cn } from "@/lib/utils";

interface PresetPillsProps {
  hasPersonalized: boolean;
  onPresetApplied: (preset: Preset) => void;
  onPersonalise: () => void;
}

export function PresetPills({
  hasPersonalized,
  onPresetApplied,
  onPersonalise,
}: PresetPillsProps) {
  const config = useLoanConfigState();

  // Find matching preset based on loan configuration
  const activePreset = PRESETS.find(
    (p) =>
      p.loans.length === config.loans.length &&
      p.loans.every(
        (pl, i) =>
          config.loans[i] &&
          pl.planType === config.loans[i].planType &&
          pl.balance === config.loans[i].balance,
      ),
  );

  // Show "Edit configuration" active state only when personalized with custom (non-preset) config
  const isCustomConfig = hasPersonalized && !activePreset;

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Pick a scenario that matches you
        </p>
        <PresentValueToggle />
      </div>

      {/* Bleed wrapper — breaks out of body px-3 on mobile */}
      <div className="relative -mx-3 sm:mx-0">
        {/* Right fade hint — mobile only */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-background to-transparent sm:hidden" />

        <div
          className="flex gap-2 overflow-x-auto pr-8 pb-1 pl-3 scrollbar-none sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Preset profiles"
        >
          {PRESETS.map((preset) => {
            const isActive = activePreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onPresetApplied(preset);
                }}
                aria-pressed={isActive}
                className={cn(
                  "shrink-0 rounded-lg border px-3 py-2 text-left transition-colors",
                  "w-40 sm:w-auto",
                  isActive
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-accent",
                )}
              >
                <span className="block text-sm font-medium">
                  {preset.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {preset.description}
                </span>
              </button>
            );
          })}

          {/* CTA card — always visible in grid on sm+ */}
          <button
            type="button"
            onClick={onPersonalise}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-2 text-left transition-colors",
              "w-40 sm:w-auto",
              "hidden sm:block",
              isCustomConfig
                ? "border-primary bg-primary/10"
                : "border-dashed border-primary/40 hover:border-primary hover:bg-primary/5",
            )}
          >
            <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
              <HugeiconsIcon
                icon={PreferenceHorizontalIcon}
                className="size-4"
              />
              {isCustomConfig ? "Edit configuration" : "Tailor to you"}
            </span>
            <span className="block text-xs text-muted-foreground">
              {isCustomConfig
                ? "Change your loan details"
                : "Enter your exact details"}
            </span>
          </button>
        </div>
      </div>

      {/* CTA below scroll on mobile only — always visible */}
      <button
        type="button"
        onClick={onPersonalise}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors sm:hidden",
          isCustomConfig
            ? "border-primary bg-primary/10"
            : "border-dashed border-primary/40 hover:border-primary hover:bg-primary/5",
        )}
      >
        <HugeiconsIcon
          icon={PreferenceHorizontalIcon}
          className="size-4 shrink-0 text-primary"
        />
        <span>
          <span className="text-sm font-medium text-primary">
            {isCustomConfig ? "Edit configuration" : "Tailor to you"}
          </span>
          <span className="ml-2 text-xs text-muted-foreground">
            {isCustomConfig
              ? "Change your loan details"
              : "Enter your exact details"}
          </span>
        </span>
      </button>
    </div>
  );
}
