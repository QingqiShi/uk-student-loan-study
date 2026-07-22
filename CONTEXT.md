# Student Loan Study

An interactive UK student-loan repayment calculator whose thesis is that _middle earners repay the most_. Every figure is sourced to GOV.UK and rendered as a calibrated instrument. This glossary is the one-name-per-concept arbitration for code, comments, and the words users read.

Spelling is **UK throughout** — identifiers and copy alike (personalise, annualised, not personalize/annualized). Numbers and rules trace to GOV.UK, so where a term is GOV.UK's, that wording wins.

## Plans & who repays

**Plan**:
A UK student-loan repayment scheme. The set is Plan 1, Plan 2, Plan 4, Plan 5, and Postgraduate. Prose uses "Plan 2"; the code enum is `PLAN_2`.
_Avoid_: scheme

**Undergraduate**:
Any of Plans 1/2/4/5 (everything except Postgraduate).
_Avoid_: undergrad, UG

**Postgraduate**:
The Master's/Doctoral loan (`POSTGRADUATE`), repaid concurrently alongside any undergraduate loan. Title-case "Postgraduate" in prose.
_Avoid_: postgrad, PG, PGL (as prose/copy)

**Doctoral**:
A PhD-level postgraduate course/loan.
_Avoid_: PhD

## What is owed

**Principal**:
The original amount borrowed, before any interest. The thesis compares total repaid against the principal ("more than you borrowed"). Copy may say "what you borrowed".
_Avoid_: original loan amount, initial balance, total balance (as names for the borrowed sum)

**Balance**:
The amount currently owed, which grows with interest and falls with repayment. "Opening balance" and "closing balance" are the per-month start/end values, and "remaining balance" is what is left at write-off — these are distinct points in time, not synonyms for balance.
_Avoid_: debt, amount owed, outstanding balance

## Income & repayment

**Income**:
The earnings a borrower's repayments are assessed on — the GOV.UK figure in the repayment rule ("9% of income above the threshold"). The app collects it through a single **annual salary** slider; that input control keeps the label "salary" as a concrete proxy, but the concept, and all copy describing the rule, is income.
_Avoid_: earnings; salary (except as the label of the salary-slider input itself)

_Note — "earner" is not "earnings"._ "Middle/low/high earner" names a person/segment (see Peak repayment zone) and is retained; only the money sense converges to income.

**Repayment threshold**:
The income level above which repayments are due. Distinct from the interest threshold (below). Prefer "annual" over "yearly" for the once-a-year value.
_Avoid_: salary threshold, yearly threshold

**Repayment**:
The mandatory amount paid toward the loan (deducted through PAYE). "Payment" is reserved for optional money (lump sum) and generic present-value cash-flows — do not use it for the statutory deduction.
_Avoid_: contribution; payment (when it means the mandatory repayment)

**Overpayment**:
A voluntary extra payment beyond the mandatory repayment. A **lump sum** is a one-off overpayment; a monthly overpayment recurs — keep the two distinct.
_Avoid_: voluntary payment, voluntary overpayment, extra payment, paying extra

**Write-off**:
The cancellation of any remaining balance at the end of the plan's term (25–40 years). Genuinely opposite to "paid off" — do not blur them.
_Avoid_: forgiven, cancelled, wiped, cleared

**Paid off**:
Fully clearing the loan by paying it down (the opposite outcome to write-off). Noun/verb form: "payoff" / "pay off".
_Avoid_: paid in full

## Interest & true cost

**RPI**:
The Retail Price Index — the index student-loan _interest_ is set from. Contrast with CPI, used only for discounting (see Present value).

**Sliding scale**:
Plan 2's income-based interest, ramping linearly from RPI (at the lower interest threshold) to RPI+3% (at the upper).
_Avoid_: uplift, interest scale, income-based interest (as the name for the mechanism)

**Interest threshold**:
The lower/upper income bands that bound Plan 2's sliding scale (`interestLowerThreshold` / `interestUpperThreshold`). A different concept from the repayment threshold — always carry the `interest` qualifier.

**BoE base rate**:
The Bank of England base rate, used to cap Plan 1/Plan 4 interest. Spelled "BoE".
_Avoid_: BOE, Boe

**Effective rate**:
The true annualised cost of the loan as an internal rate of return (IRR) — lower than the headline rate because it accounts for write-off. The Readout quadrant and the `/effective-rate` tool.
_Avoid_: effective interest rate, true rate, true cost, true annualized cost

**Headline interest rate**:
The stated/nominal interest rate applied to the balance — the deliberate contrast to the effective rate. Keep this term where the two are compared.

## Inflation adjustment

**Present value**:
Money discounted to today's terms. The user-facing toggle is labelled **"Adjust for inflation"**; the opposite (un-discounted) state is **nominal**.
_Avoid_ (as the label for this toggle/state): today's money, in real terms, inflation-adjusted

**Discount rate**:
The rate used to compute present value, defaulting to **CPI** (distinct from RPI, which drives interest).

## Results & the headline

**Total repaid**:
The headline lifetime-repayment figure — the instrument's trust number. Distinct from `totalSettled` (repaid + written-off), which is a different quantity.
_Avoid_: total cost, lifetime total, lifetime repaid (as the name of the figure)

**Insight**:
The personalised reading on the home page that classifies the user (low/middle/high earner) and states their outcome; surfaced as the live chart "reading".

**Recommendation**:
The overpay tool's advice — one of `dont-overpay | overpay | marginal | idle`. Shown to users as the **"Verdict"**. A separate concept from Insight (different flow, different value space) — not a synonym.

**Peak repayment zone**:
The middle-income band where lifetime repayment peaks — the core thesis. The three audience segments are **low earner / middle earner / high earner** (`InsightType`); retain "earner" (see Income).

## The interface

**Instrument**:
The design system and its metaphor — the page as a calibrated measuring instrument, not a marketing site (see `DESIGN.md`). The signature container is the **Instrument panel** (the framed dial).

**Readout**:
The four-quadrant headline panel (Total repaid / Payoff timeline / Interest / Effective rate) rendered as one bordered panel split by seams. Also names the Martian Mono figure treatment — figures are always Readout type, never sans.

**Preset**:
A predefined loan+salary configuration selectable as a chip; surfaced in the UI as a **"scenario preset"**. Note "scenario" is overloaded — it also names the two arms of the overpay comparison (below); keep "preset" for the configs.

**Baseline / Overpay scenario**:
The two compared arms of the overpay analysis — `baseline` (no overpayment) versus `overpay` (with it). This is the "scenario" of `ScenarioResult` / `simulateOverpayScenarios`.

**Personalise**:
The act of editing your inputs away from a preset. The entry-point button is labelled **"Tailor to you"** (and "Edit details" once personalised). One concept, one action.
_Avoid_: personalize/personalized (US spelling), customise, custom (as the name of this action)

**Assumptions**:
The tunable forward-looking estimates — salary growth, threshold growth, RPI, BoE base rate, and discount rate — edited in the **assumptions wizard**. The umbrella term for this cluster is "assumptions", not "config" (which is the broader input state, including the loans themselves).
_Avoid_: settings; config (as the name for this rate/growth cluster)

**Wizard** vs **Quiz**:
Two distinct step-flows. The **assumptions wizard** tunes the assumptions above; the **quiz** (`/which-plan`) determines which plan(s) a user is on. They share a generic step-reducer but are not the same flow.

## Modelling primitives

**Career break**:
A modelled window of reduced or zero income (e.g. parental leave) during which repayments follow the lower income but interest still accrues.

**Threshold freeze**:
The Plan 2 policy that freezes the repayment threshold to fixed values for 2027–2030 before growth resumes (`plan2ThresholdSchedule`).

**Tax year**:
The UK 6 April–5 April year used for thresholds and the freeze. Distinct from the **simulation year** (1-indexed month-of-simulation) and any calendar `year` on a chart point — three different "year" units; keep them named apart.
