import { formatGBP } from "@/lib/format";
import { PLAN_CONFIGS } from "@/lib/loans/plans";
import { getCurrentTaxYearLabel } from "@/lib/taxYear";
import { HomeSection } from "./HomeSection";

// Live figures from the source-of-truth modules (kept current by the GOV.UK
// automation) — never hardcode a value that exists in PLAN_CONFIGS.
const TAX_YEAR = getCurrentTaxYearLabel();
const PLAN2 = PLAN_CONFIGS.PLAN_2;
const PLAN2_THRESHOLD = formatGBP(PLAN2.monthlyThreshold * 12);
const PLAN2_RATE = Math.round(PLAN2.repaymentRate * 100);
const PLAN2_WRITEOFF = PLAN2.writeOffYears;

export function RulesSection() {
  return (
    <HomeSection
      id="rules"
      heading="Four rules decide what you repay"
      intro={
        <>
          No estimates or averages hidden in the model — these are the published
          figures for the {TAX_YEAR} tax year, applied plainly.
        </>
      }
    >
      <div className="mt-[clamp(1.6rem,2.4vw,2.4rem)] grid grid-cols-1 gap-x-[clamp(1.8rem,2.4vw,3rem)] gap-y-[clamp(1.6rem,2.2vw,2.4rem)] sm:grid-cols-2 broad:grid-cols-4 work:mt-0">
        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-[0.85rem]">
          <span className="font-mono text-fig-sm font-semibold tracking-[-0.01em] text-primary">
            01
          </span>
          <h3 className="col-start-2 mb-[0.35rem] text-lead font-semibold tracking-[-0.011em]">
            You repay above a set salary
          </h3>
          <p className="col-start-2 text-body leading-[1.55] text-pretty text-muted-foreground">
            On Plan 2 you pay {PLAN2_RATE}% of everything you earn over{" "}
            {PLAN2_THRESHOLD} a year. Earn less in a month and you repay nothing
            that month.
          </p>
          <span className="col-start-2 mt-[0.55rem] font-sans text-meta text-muted-foreground">
            Plan 2 threshold · {PLAN2_THRESHOLD}
          </span>
        </div>
        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-[0.85rem]">
          <span className="font-mono text-fig-sm font-semibold tracking-[-0.01em] text-primary">
            02
          </span>
          <h3 className="col-start-2 mb-[0.35rem] text-lead font-semibold tracking-[-0.011em]">
            Interest is linked to RPI
          </h3>
          <p className="col-start-2 text-body leading-[1.55] text-pretty text-muted-foreground">
            The balance grows with inflation. Interest runs from RPI up to RPI +
            3%, set by how much you earn — not by a fixed headline rate.
          </p>
          <span className="col-start-2 mt-[0.55rem] font-sans text-meta text-muted-foreground">
            RPI to RPI + 3%
          </span>
        </div>
        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-[0.85rem]">
          <span className="font-mono text-fig-sm font-semibold tracking-[-0.01em] text-primary">
            03
          </span>
          <h3 className="col-start-2 mb-[0.35rem] text-lead font-semibold tracking-[-0.011em]">
            The balance clears at {PLAN2_WRITEOFF} years
          </h3>
          <p className="col-start-2 text-body leading-[1.55] text-pretty text-muted-foreground">
            Anything unpaid {PLAN2_WRITEOFF} years after you were first due to
            repay is cancelled. On a middle income, reaching that point is the
            norm, not the exception.
          </p>
          <span className="col-start-2 mt-[0.55rem] font-sans text-meta text-muted-foreground">
            Plan 2 write-off · {PLAN2_WRITEOFF} years
          </span>
        </div>
        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-[0.85rem]">
          <span className="font-mono text-fig-sm font-semibold tracking-[-0.01em] text-primary">
            04
          </span>
          <h3 className="col-start-2 mb-[0.35rem] text-lead font-semibold tracking-[-0.011em]">
            GOV.UK figures, kept current
          </h3>
          <p className="col-start-2 text-body leading-[1.55] text-pretty text-muted-foreground">
            Thresholds, repayment rates and the RPI figure come straight from
            GOV.UK and the Bank of England, and are refreshed when they change.
          </p>
          <span className="col-start-2 mt-[0.55rem] font-sans text-meta text-muted-foreground">
            {TAX_YEAR} tax year
          </span>
        </div>
      </div>
    </HomeSection>
  );
}
