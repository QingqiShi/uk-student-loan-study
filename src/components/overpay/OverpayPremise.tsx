"use client";

import { primaryPlanName } from "@/components/home/instrument/planInfo";
import { Figure } from "@/components/typography/Figure";
import { useCurrentSalary, useLoanConfig } from "@/hooks/useStoreSelectors";
import { formatGBP } from "@/lib/format";
import { PROSE_LINK } from "@/lib/layout";

/**
 * The loan the comparison is running on.
 *
 * The verdict is a conditional — "given this loan and this overpayment, the
 * answer is X" — and a phone reads the fold in sequence, so the condition has
 * to arrive first or the answer lands on a reader who has seen none of the
 * figures behind it. This states the loan, the console below it states the
 * overpayment, and only then does the verdict answer. On a wide screen the rail
 * shows all three at once, so it simply heads the console.
 */
export function OverpayPremise() {
  const { loans, underGradBalance, postGradBalance } = useLoanConfig();
  const salary = useCurrentSalary();
  const balance = underGradBalance + postGradBalance;

  return (
    // A caption, not a field: no engraved key, so it doesn't read as a third
    // control alongside the two levers below it. `Change` runs on in the same
    // line rather than being pushed to the far edge, so a narrow phone doesn't
    // spend a whole line on it; it jumps to the section that owns these figures.
    <p className="text-meta text-muted-foreground">
      {primaryPlanName(loans)} <span className="text-faint">·</span>{" "}
      <Figure className="text-foreground">{formatGBP(balance)}</Figure> balance{" "}
      <span className="text-faint">·</span>{" "}
      <Figure className="text-foreground">{formatGBP(salary)}</Figure> income{" "}
      <span className="text-faint">·</span>{" "}
      <a href="#situation" className={PROSE_LINK}>
        Change
      </a>
    </p>
  );
}
