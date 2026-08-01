"use client";

import { PreferenceHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { startTransition, useOptimistic, type ReactNode } from "react";
import { ConfigOverlay } from "@/components/home/ConfigOverlay";
import { PresentValueToggle } from "@/components/home/PresentValueToggle";
import { InstrumentSection } from "@/components/instrument/InstrumentSection";
import { AssumptionsCallout } from "@/components/shared/AssumptionsCallout";
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
import { useInputPanelMode } from "@/hooks/useInputPanelMode";
import { trackSalaryChanged } from "@/lib/analytics";
import { SECTION_BODY_PAD } from "@/lib/layout";
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
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Salary
        </span>
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
  hasPersonalised: boolean;
}

function ExpandedPresets({
  onPresetApplied,
  onPersonalise,
  hasPersonalised,
}: ExpandedPresetsProps) {
  const activePreset = useActivePreset();

  const [optimisticActiveId, setOptimisticActiveId] = useOptimistic(
    activePreset?.id ?? null,
  );

  const isPersonalisedConfig = hasPersonalised && !optimisticActiveId;

  return (
    <div className="@container space-y-2">
      <div className="flex flex-col gap-1 @tight:flex-row @tight:items-center @tight:justify-between">
        <p className="text-sm text-muted-foreground">
          Pick a scenario that matches you
        </p>
        <PresentValueToggle />
      </div>

      {/* Background-agnostic scroll affordance: a mask fades the trailing chip
          on mobile rather than a gradient matched to the ground behind it.
          `pr-8` matches the 2rem fade — scrolled to the end, that padding parks
          under the gradient so the last chip stays fully legible. The chips
          start at the page gutter; there is no panel padding to break out of.

          The column count comes from the console's *own* width, not the
          viewport: this same console now stands in a ~32rem fold rail on a
          detail page and in a near-full-bleed band on the overpay page, and a
          viewport breakpoint cannot tell those apart — it put five chips in the
          rail and squeezed every label onto three lines. */}
      <div
        className="no-scrollbar flex gap-2 overflow-x-auto mask-[linear-gradient(to_right,#000_calc(100%-2rem),transparent)] pr-8 pb-1 [-webkit-mask-image:linear-gradient(to_right,#000_calc(100%-2rem),transparent)] @tight:grid @tight:grid-cols-2 @tight:overflow-visible @tight:mask-none @tight:pr-0 @tight:pb-0 @tight:[-webkit-mask-image:none] @cozy:grid-cols-4 @snug:grid-cols-5"
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
                "w-40 @tight:w-auto",
                isActive
                  ? "border-primary bg-accent-wash"
                  : "border-border hover:border-primary/50 hover:bg-accent",
              )}
            >
              <span
                className={cn(
                  "block text-sm font-medium",
                  isActive && "text-cta",
                )}
              >
                {preset.label}
              </span>
              <span className="block text-xs text-muted-foreground">
                {preset.description}
              </span>
            </button>
          );
        })}

        {/* CTA card — joins the grid as its own row, then takes the fifth
            column once there is one to take. */}
        <button
          type="button"
          onClick={onPersonalise}
          className={cn(
            "shrink-0 rounded-lg border px-3 py-2 text-left transition-colors",
            "w-40 @tight:w-auto",
            "hidden @tight:col-span-full @tight:block @snug:col-auto",
            isPersonalisedConfig
              ? "border-primary bg-accent-wash"
              : "border-dashed border-primary/40 hover:border-primary hover:bg-primary/5",
          )}
        >
          <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <HugeiconsIcon icon={PreferenceHorizontalIcon} className="size-4" />
            {isPersonalisedConfig ? "Edit details" : "Tailor to you"}
          </span>
          <span className="block text-xs text-muted-foreground">
            {isPersonalisedConfig
              ? "Change your loan details"
              : "Enter your exact details"}
          </span>
        </button>
      </div>

      {/* CTA below the chips while they are a scroller, so it is never the
          one card the reader has to scroll sideways to find. */}
      <button
        type="button"
        onClick={onPersonalise}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors @tight:hidden",
          isPersonalisedConfig
            ? "border-primary bg-accent-wash"
            : "border-dashed border-primary/40 hover:border-primary hover:bg-primary/5",
        )}
      >
        <HugeiconsIcon
          icon={PreferenceHorizontalIcon}
          className="size-4 shrink-0 text-primary"
        />
        <span>
          <span className="text-sm font-medium text-primary">
            {isPersonalisedConfig ? "Edit details" : "Tailor to you"}
          </span>
          <span className="ml-2 text-xs text-muted-foreground">
            {isPersonalisedConfig
              ? "Change your loan details"
              : "Enter your exact details"}
          </span>
        </span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ControlBar — main export (always expanded)
// ---------------------------------------------------------------------------

/**
 * The salary + scenario console shared by every full-bleed tool page: it sits
 * flat on the paper inside a seamed `InstrumentSection`, the way the homepage
 * fold's own controls do. No panel frame — the section's masthead rail and the
 * hairline seams already place it.
 */
export function ControlBar() {
  const {
    mode,
    hasPersonalised,
    handlePersonalise,
    handlePresetApplied,
    handleWizardComplete,
    handleWizardClose,
  } = useInputPanelMode();

  return (
    <section aria-label="Calculator controls" className="space-y-4">
      <SalarySlider />
      <ExpandedPresets
        onPresetApplied={handlePresetApplied}
        onPersonalise={handlePersonalise}
        hasPersonalised={hasPersonalised}
      />
      <ConfigOverlay
        mode={mode}
        hasPersonalised={hasPersonalised}
        onComplete={handleWizardComplete}
        onClose={handleWizardClose}
      />
    </section>
  );
}

/**
 * The band that states whose loan the page is reporting on, and lets the reader
 * change it. Shared by every full-bleed tool page so the console always sits in
 * the same place, under the same seam, with the assumptions it runs on beneath it.
 *
 * The heading and intro are the caller's because each page feeds the console into
 * a different question. The intro should say what the section feeds and stop
 * there: the console already tells the reader to pick a scenario or enter their
 * own figures, and two copies of that would drift apart.
 */
export function SituationSection({
  heading,
  intro,
  children,
}: {
  heading: ReactNode;
  intro: ReactNode;
  /** Extra facts about the loan, rendered between the console and the assumptions. */
  children?: ReactNode;
}) {
  return (
    <InstrumentSection id="situation" heading={heading} intro={intro}>
      <div
        className={cn(SECTION_BODY_PAD, "space-y-[clamp(1.2rem,1.8vw,1.8rem)]")}
      >
        <ControlBar />
        {children}
        <AssumptionsCallout className="text-left" />
      </div>
    </InstrumentSection>
  );
}
