import { cn } from "@/lib/utils";

type Condition = {
  when: boolean;
  label: string;
  variant: "warning" | "success";
};

interface OutcomeBadgeProps {
  conditions: Condition[];
}

/**
 * A flat Instrument status chip: a hairline-ruled pill with an engraved sans
 * label and a single tonal dot — the Principal data green for a positive outcome
 * (paid off), the Interest clay for a caution (written off). No filled status
 * backgrounds, no rounded
 * Ledger badge — the meaning rides on the dot and the word.
 */
export function OutcomeBadge({ conditions }: OutcomeBadgeProps) {
  const match = conditions.find((c) => c.when);
  if (!match) return null;

  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-card px-2.5 py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase ring-1 ring-border">
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          match.variant === "warning"
            ? "bg-chart-interest"
            : "bg-chart-principal",
        )}
      />
      {match.label}
    </span>
  );
}
