import type { ReactNode } from "react";

interface OptionGroupProps {
  /** Accessible name for the group of options. */
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * A `role="radiogroup"` wrapper that gives a set of `OptionCard` radios a single
 * accessible name — the same grouping the wizard steps apply inline. Choosing an
 * option immediately advances the quiz, so the options are plain Tab stops like
 * every other radiogroup in the app; we deliberately don't add roving tabindex or
 * arrow-to-select, which assume a review-then-submit group and would fight the
 * auto-advance (arrowing onto an option would commit it and jump to the next step).
 */
export function OptionGroup({ label, children, className }: OptionGroupProps) {
  return (
    <div role="radiogroup" aria-label={label} className={className}>
      {children}
    </div>
  );
}
