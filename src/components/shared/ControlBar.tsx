"use client";

import { PreferenceHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { startTransition, useOptimistic } from "react";
import { LoanConfigPanel } from "@/components/home/LoanConfigPanel";
import { PresentValueToggle } from "@/components/home/PresentValueToggle";
import { Slider } from "@/components/ui/slider";
import {
  MIN_SALARY,
  MAX_SALARY,
  SALARY_STEP,
  SALARY_GROWTH_OPTIONS,
  currencyFormatter,
} from "@/constants";
import {
  useLoanActions,
  useLoanConfigState,
  useLoanFrequentState,
} from "@/context/LoanContext";
import type { InputMode } from "@/hooks/useInputPanelMode";
import { useInputPanelMode } from "@/hooks/useInputPanelMode";
import { trackSalaryChanged } from "@/lib/analytics";
import type { Preset } from "@/lib/presets";
import { PRESETS } from "@/lib/presets";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Shared: find the active preset from current loan config
// ---------------------------------------------------------------------------

function useActivePreset() {
  const config = useLoanConfigState();
  return PRESETS.find(
    (p) =>
      p.loans.length === config.loans.length &&
      p.loans.every(
        (pl, i) =>
          config.loans[i] &&
          pl.planType === config.loans[i].planType &&
          pl.balance === config.loans[i].balance,
      ),
  );
}

// ---------------------------------------------------------------------------
// Salary slider section
// ---------------------------------------------------------------------------

function SalarySlider() {
  const { salary } = useLoanFrequentState();
  const { salaryGrowthRate } = useLoanConfigState();
  const { updateField } = useLoanActions();
  const [optimisticSalary, setOptimisticSalary] = useOptimistic(salary);

  const growthLabel =
    SALARY_GROWTH_OPTIONS.find((o) => o.value === salaryGrowthRate)?.label ??
    `${(salaryGrowthRate * 100).toFixed(0)}%`;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div className="flex shrink-0 items-baseline gap-1.5">
        <span className="text-xs text-muted-foreground">Salary</span>
        <span className="font-mono text-sm font-semibold tabular-nums">
          {currencyFormatter.format(optimisticSalary)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <Slider
          value={[optimisticSalary]}
          min={MIN_SALARY}
          max={MAX_SALARY}
          step={SALARY_STEP}
          onValueChange={(value) => {
            const v = typeof value === "number" ? value : value[0];
            startTransition(() => {
              setOptimisticSalary(v);
              updateField("salary", v);
            });
          }}
          onValueCommitted={(value) => {
            const v = typeof value === "number" ? value : value[0];
            trackSalaryChanged(v);
          }}
          aria-label="Adjust your annual salary"
        />
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">
        +{growthLabel}/yr
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Expanded preset buttons
// ---------------------------------------------------------------------------

interface ExpandedPresetsProps {
  onPresetApplied: (preset: Preset) => void;
  onPersonalise: () => void;
  hasPersonalized: boolean;
}

function ExpandedPresets({
  onPresetApplied,
  onPersonalise,
  hasPersonalized,
}: ExpandedPresetsProps) {
  const activePreset = useActivePreset();

  const [optimisticActiveId, setOptimisticActiveId] = useOptimistic(
    activePreset?.id ?? null,
  );

  const isCustomConfig = hasPersonalized && !optimisticActiveId;

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Pick a scenario that matches you
        </p>
        <PresentValueToggle />
      </div>

      {/* Bleed wrapper — breaks out of container padding on mobile */}
      <div className="relative -mx-3 sm:mx-0">
        {/* Right fade hint — mobile only */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-card to-transparent sm:hidden" />

        <div
          className="no-scrollbar flex gap-2 overflow-x-auto pr-8 pb-1 pl-3 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0 sm:pb-0"
          role="group"
          aria-label="Preset profiles"
        >
          {PRESETS.map((preset) => {
            const isActive = optimisticActiveId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  startTransition(() => {
                    setOptimisticActiveId(preset.id);
                    onPresetApplied(preset);
                  });
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

// ---------------------------------------------------------------------------
// LoanConfigPanel overlay
// ---------------------------------------------------------------------------

function ConfigOverlay({
  mode,
  hasPersonalized,
  onComplete,
  onClose,
}: {
  mode: InputMode;
  hasPersonalized: boolean;
  onComplete: () => void;
  onClose: () => void;
}) {
  if (mode.view !== "loan-config") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Configure your loans"
      className="fixed inset-0 z-50 flex min-h-dvh flex-col overflow-y-auto bg-background"
    >
      <LoanConfigPanel
        isEditing={hasPersonalized}
        initialPlanTypes={mode.initialPlanTypes}
        onComplete={onComplete}
        onClose={onClose}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ControlBar — main export (always expanded)
// ---------------------------------------------------------------------------

interface ControlBarProps {
  initialMode?: InputMode;
}

export function ControlBar({ initialMode }: ControlBarProps) {
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
      aria-label="Calculator settings"
      className="space-y-3 rounded-xl bg-card p-3 ring-1 ring-foreground/10 sm:p-4"
    >
      <SalarySlider />
      <ExpandedPresets
        onPresetApplied={handlePresetApplied}
        onPersonalise={handlePersonalise}
        hasPersonalized={hasPersonalized}
      />
      <ConfigOverlay
        mode={mode}
        hasPersonalized={hasPersonalized}
        onComplete={handleWizardComplete}
        onClose={handleWizardClose}
      />
    </section>
  );
}
