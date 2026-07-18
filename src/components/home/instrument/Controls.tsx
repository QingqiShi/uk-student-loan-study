"use client";

import { PreferenceHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  startTransition,
  useEffect,
  useOptimistic,
  useRef,
  useState,
} from "react";
import { ConfigOverlay } from "@/components/home/ConfigOverlay";
import {
  currencyFormatter,
  MAX_SALARY,
  MIN_SALARY,
  SALARY_GROWTH_OPTIONS,
  SALARY_STEP,
} from "@/constants";
import {
  useLoanActions,
  useLoanConfigState,
  useLoanFrequentState,
} from "@/context/LoanContext";
import type { InputMode } from "@/hooks/useInputPanelMode";
import { trackSalaryChanged } from "@/lib/analytics";
import type { Preset } from "@/lib/presets";
import { PRESETS } from "@/lib/presets";

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
// Salary slider (native range styled by the scoped `.slider` CSS)
// ---------------------------------------------------------------------------

function SalarySlider() {
  const { salary } = useLoanFrequentState();
  const { salaryGrowthRate } = useLoanConfigState();
  const { updateField } = useLoanActions();
  const [optimisticSalary, setOptimisticSalary] = useOptimistic(salary);

  const growthLabel =
    SALARY_GROWTH_OPTIONS.find((o) => o.value === salaryGrowthRate)?.label ??
    `${String(Math.round(salaryGrowthRate * 100))}%`;

  const fill = Math.min(
    Math.max(
      ((optimisticSalary - MIN_SALARY) / (MAX_SALARY - MIN_SALARY)) * 100,
      0,
    ),
    100,
  );

  return (
    <div className="flex flex-col gap-[0.6rem] wide:max-w-[540px] wide:min-w-[280px] wide:flex-[1_1_340px] work:min-w-0 work:flex-[0_0_auto]">
      <div className="flex items-baseline gap-[0.6rem]">
        <span className="font-sans text-xs font-semibold tracking-label text-muted-foreground uppercase">
          Salary
        </span>
        <span className="ml-auto font-mono text-fig-md font-semibold tracking-[-0.015em] tabular-nums">
          <span className="mr-[0.05em] text-[0.64em] font-medium tracking-normal text-faint">
            £
          </span>
          {optimisticSalary.toLocaleString("en-GB")}
          <span className="ml-[0.22em] font-sans text-[0.58em] font-medium tracking-[0.01em] text-muted-foreground">
            / year
          </span>
        </span>
        <span className="ml-[0.1rem] font-sans text-meta text-muted-foreground">
          +{growthLabel}/yr
        </span>
      </div>
      <input
        className="m-0 h-[22px] w-full cursor-pointer appearance-none bg-transparent [-webkit-appearance:none] [&::-moz-range-progress]:h-[6px] [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-primary [&::-moz-range-thumb]:size-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-card [&::-moz-range-thumb]:[box-shadow:0_1px_3px_rgba(0,0,0,0.25)] [&::-moz-range-thumb]:[border:3px_solid_var(--primary)] [&::-moz-range-thumb]:[transition:transform_0.12s_ease,box-shadow_0.12s_ease] [&::-moz-range-track]:h-[6px] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:[background:var(--slider-track)] [&::-webkit-slider-runnable-track]:h-[6px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:[background:linear-gradient(90deg,var(--primary)_0_var(--fill,30%),var(--slider-track)_var(--fill,30%)_100%)] [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:size-[18px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-card [&::-webkit-slider-thumb]:[box-shadow:0_1px_3px_rgba(0,0,0,0.25)] [&::-webkit-slider-thumb]:[-webkit-appearance:none] [&::-webkit-slider-thumb]:[border:3px_solid_var(--primary)] [&::-webkit-slider-thumb]:[transition:transform_0.12s_ease,box-shadow_0.12s_ease] [&:active::-moz-range-thumb]:transform-[scale(1.06)] [&:active::-moz-range-thumb]:[box-shadow:0_3px_8px_rgba(0,0,0,0.3)] [&:active::-webkit-slider-thumb]:transform-[scale(1.06)] [&:active::-webkit-slider-thumb]:[box-shadow:0_3px_8px_rgba(0,0,0,0.3)] [&:hover:not(:active)::-moz-range-thumb]:transform-[scale(1.14)] [&:hover:not(:active)::-webkit-slider-thumb]:transform-[scale(1.14)]"
        type="range"
        min={MIN_SALARY}
        max={MAX_SALARY}
        step={SALARY_STEP}
        value={optimisticSalary}
        style={{ "--fill": `${String(fill)}%` } as React.CSSProperties}
        aria-label="Annual salary"
        aria-valuetext={`${currencyFormatter.format(optimisticSalary)} per year`}
        onChange={(e) => {
          const v = Number(e.target.value);
          startTransition(() => {
            setOptimisticSalary(v);
            updateField("salary", v);
          });
        }}
        onPointerUp={(e) => {
          trackSalaryChanged(Number(e.currentTarget.value));
        }}
        onKeyUp={(e) => {
          trackSalaryChanged(Number(e.currentTarget.value));
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scenario presets + "Tailor to you"
// ---------------------------------------------------------------------------

interface PresetsProps {
  onPresetApplied: (preset: Preset) => void;
  onPersonalise: () => void;
  hasPersonalized: boolean;
}

type ScenFade = "none" | "left" | "right" | "both";

/** Which edges of the preset scroller still have off-screen chips. */
function computeScenFade(el: HTMLDivElement | null): ScenFade {
  if (!el) return "none";
  const canLeft = el.scrollLeft > 1;
  const canRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
  return canLeft && canRight
    ? "both"
    : canLeft
      ? "left"
      : canRight
        ? "right"
        : "none";
}

// Shared preset-chip utilities (applied to every scenario chip + "Tailor").
// `:not([aria-pressed=true]):hover` keeps a selected chip's primary border on
// hover (the original relied on source order: aria-pressed after :hover).
const SCEN_CHIP =
  "group flex flex-[0_0_auto] flex-col gap-[0.15rem] min-w-[8.5rem] [scroll-snap-align:start] leading-[1.2] text-left border border-border rounded-[9px] px-[0.7rem] py-[0.5rem] bg-card text-muted-foreground [transition:border-color_0.15s,background_0.15s,color_0.15s] [&:not([aria-pressed=true]):hover]:border-muted-foreground @cozy:min-w-0 work:min-w-0 aria-pressed:border-primary aria-pressed:bg-accent-wash";

// "Tailor to you" is a different *kind* of action than the preset chips — an
// escape hatch into customisation rather than a mutually-exclusive quick-pick.
// A dashed primary outline + icon marks it as distinct; it flips to a solid
// selected treatment (matching the presets) once the config is personalised.
const TAILOR_CHIP =
  "group rounded-[9px] border border-dashed border-primary/40 px-[0.7rem] py-[0.5rem] text-left leading-[1.2] [transition:border-color_0.15s,background_0.15s,color_0.15s] hover:border-primary hover:bg-primary/5 aria-pressed:border-solid aria-pressed:border-primary aria-pressed:bg-accent-wash";

// One button, two layouts: the narrow scroll state shows the "bar" variant
// full-width below the strip; wider grid layouts show the "grid" variant as a
// card in-row. Copy, handler, and aria-pressed live here once so the two
// rendered instances can never drift apart.
function TailorButton({
  variant,
  className,
  isCustomConfig,
  onPersonalise,
}: {
  variant: "grid" | "bar";
  className: string;
  isCustomConfig: boolean;
  onPersonalise: () => void;
}) {
  const label = isCustomConfig ? "Edit details" : "Tailor to you";
  const description = isCustomConfig ? "Your configuration" : "Your details";
  return (
    <button
      className={`${TAILOR_CHIP} ${className}`}
      type="button"
      aria-pressed={isCustomConfig}
      onClick={onPersonalise}
    >
      {variant === "grid" ? (
        <>
          <b className="flex items-center gap-1.5 text-sm font-semibold tracking-[-0.01em] text-primary group-aria-pressed:text-cta">
            <HugeiconsIcon
              icon={PreferenceHorizontalIcon}
              className="size-4 shrink-0"
            />
            {label}
          </b>
          <span className="font-sans text-micro text-muted-foreground">
            {description}
          </span>
        </>
      ) : (
        <>
          <HugeiconsIcon
            icon={PreferenceHorizontalIcon}
            className="size-4 shrink-0 text-primary group-aria-pressed:text-cta"
          />
          <span className="flex-1">
            <span className="text-sm font-semibold tracking-[-0.01em] text-primary group-aria-pressed:text-cta">
              {label}
            </span>
            <span className="ml-2 font-sans text-micro text-muted-foreground">
              {description}
            </span>
          </span>
        </>
      )}
    </button>
  );
}

function Presets({
  onPresetApplied,
  onPersonalise,
  hasPersonalized,
}: PresetsProps) {
  const activePreset = useActivePreset();
  const [optimisticActiveId, setOptimisticActiveId] = useOptimistic(
    activePreset?.id ?? null,
  );
  const isCustomConfig = hasPersonalized && !optimisticActiveId;

  // Drive the horizontal-scroll edge fade from the live scroll position so it
  // only shows on a side that actually has more chips (was a static right fade).
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState<ScenFade>("right");

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setFade(computeScenFade(el));
    };
    // ResizeObserver fires an initial callback on observe(), which sets the
    // starting fade — no synchronous setState needed here.
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="@container max-w-full min-w-0 overflow-x-hidden wide:flex-[1_1_580px] work:w-full work:min-w-0 work:flex-[0_0_auto]"
      role="group"
      aria-label="Repayment scenarios"
    >
      <div
        className="flex max-w-full min-w-0 [scroll-snap-type:x_proximity] scrollbar-thin [scrollbar-color:var(--border)_transparent] gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] data-[fade=both]:mask-[linear-gradient(to_right,transparent,#000_1.75rem,#000_calc(100%-1.75rem),transparent)] data-[fade=both]:[-webkit-mask-image:linear-gradient(to_right,transparent,#000_1.75rem,#000_calc(100%-1.75rem),transparent)] data-[fade=left]:mask-[linear-gradient(to_left,#000_calc(100%-1.75rem),transparent)] data-[fade=left]:[-webkit-mask-image:linear-gradient(to_left,#000_calc(100%-1.75rem),transparent)] data-[fade=right]:mask-[linear-gradient(to_right,#000_calc(100%-1.75rem),transparent)] data-[fade=right]:[-webkit-mask-image:linear-gradient(to_right,#000_calc(100%-1.75rem),transparent)] work:grid work:grid-cols-2 work:overflow-x-visible work:pb-0 work:data-fade:mask-none work:data-fade:[-webkit-mask-image:none] @cozy:grid @cozy:grid-cols-4 @cozy:overflow-x-visible @cozy:pb-0 @cozy:data-fade:mask-none @cozy:data-fade:[-webkit-mask-image:none] @snug:grid-cols-5 [&::-webkit-scrollbar]:h-[4px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-(--border)"
        ref={scrollerRef}
        data-fade={fade}
        onScroll={() => {
          setFade(computeScenFade(scrollerRef.current));
        }}
      >
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={SCEN_CHIP}
            type="button"
            aria-pressed={optimisticActiveId === preset.id}
            onClick={() => {
              startTransition(() => {
                setOptimisticActiveId(preset.id);
                onPresetApplied(preset);
              });
            }}
          >
            <b className="text-sm font-semibold tracking-[-0.01em] text-foreground group-aria-pressed:text-cta">
              {preset.label}
            </b>
            <span className="font-sans text-micro text-muted-foreground">
              {preset.description}
            </span>
          </button>
        ))}
        {/* Distinct "Tailor" card — lives inside the grid on wider layouts,
            hidden in the narrow horizontal-scroll state (shown below instead). */}
        <TailorButton
          variant="grid"
          className="hidden flex-col gap-[0.15rem] work:col-span-full work:flex @cozy:col-span-full @cozy:flex @snug:col-auto"
          isCustomConfig={isCustomConfig}
          onPersonalise={onPersonalise}
        />
      </div>

      {/* Full-width "Tailor" CTA on its own line — only in the narrow
          horizontal-scroll state, so it stays visible without scrolling. */}
      <TailorButton
        variant="bar"
        className="mt-2 flex w-full items-center gap-2 work:hidden @cozy:hidden"
        isCustomConfig={isCustomConfig}
        onPersonalise={onPersonalise}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Controls — salary slider + presets + config overlay
// ---------------------------------------------------------------------------

interface ControlsProps {
  mode: InputMode;
  hasPersonalized: boolean;
  handlePersonalise: () => void;
  handlePresetApplied: (preset: Preset) => void;
  handleWizardComplete: () => void;
  handleWizardClose: () => void;
}

export function Controls({
  mode,
  hasPersonalized,
  handlePersonalise,
  handlePresetApplied,
  handleWizardComplete,
  handleWizardClose,
}: ControlsProps) {
  return (
    <div data-slot="controls" className="[grid-area:controls] work:self-start">
      <div className="flex flex-col gap-[1.1rem] wide:flex-row wide:flex-wrap wide:items-start wide:justify-between wide:gap-[clamp(1.5rem,3vw,3rem)] work:flex-col work:flex-nowrap work:items-stretch work:justify-start">
        <SalarySlider />
        <Presets
          onPresetApplied={handlePresetApplied}
          onPersonalise={handlePersonalise}
          hasPersonalized={hasPersonalized}
        />
      </div>
      <ConfigOverlay
        mode={mode}
        hasPersonalized={hasPersonalized}
        onComplete={handleWizardComplete}
        onClose={handleWizardClose}
      />
    </div>
  );
}
