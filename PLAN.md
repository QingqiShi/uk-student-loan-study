# Feature Planning: UK Student Loan Calculator

## Vision

Visualization-first education for UK student loan repayments. The core differentiator is showing how **middle earners pay the most** — an insight competitors bury under dry forms and numbers.

**Target audience**: UK graduates navigating repayments and overpayment decisions.

---

## Current Features

- 4 preset personas (Plan 1, Plan 2, Plan 5, UG+PG) with one-click setup
- "What Plan Am I On?" quiz at `/which-plan` (region → year → course → postgrad)
- Shareable results via encoded URLs with dynamic OG metadata
- "Should I Overpay?" calculator at `/overpay` with comparison chart, verdict, and lump sum support
- Salary explorer with real-time chart annotations and growth rate assumptions
- Balance over time and total repayment charts (Recharts)
- All 5 plan types: Plan 1, 2, 4, 5, Postgraduate
- Full dark mode with system preference detection
- Full configuration wizard (loan amounts, assumptions)
- Web Worker offloading for simulation calculations
- Vercel Analytics instrumentation

---

## Competitor Landscape

| Competitor                         | Strengths                                                    | Weaknesses                                 |
| ---------------------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| **MoneySavingExpert**              | Trusted brand, educational content, Martin Lewis videos      | Calculator lacks visual appeal, text-heavy |
| **studentloancalculator.uk**       | Multiple specialized calculators (overpayment, early payoff) | Generic UI, no differentiation             |
| **studentfinancecalculator.co.uk** | Plan finder tool, career break modeling                      | Complex interface                          |
| **mystudentloancalc.co.uk**        | Overpay vs invest comparison                                 | Limited visualization                      |

**Our edge**: No competitor does visualization-first education. We show the emotional and financial impact, not just numbers.

_Last reviewed: Feb 2025. Re-check periodically to see if competitors have caught up._

---

## Next Up

### 1. Test Coverage (Tech Debt)

The domain logic is well-tested (engine, interest, reducers, URL encoding — 21 test files, ~457 cases). The gaps are integration and e2e coverage: 30+ UI components have no tests, there are no Playwright tests, and coverage thresholds sit at 20%.

**Phase A: Playwright e2e for critical journeys**

These are the flows that, if broken, directly lose user trust:

- **Preset → results**: Click a preset card → results update with correct plan/balance/summary
- **Quiz → calculator**: Complete quiz → lands on calculator with correct plan pre-filled
- **Overpay flow**: Configure overpayment → comparison chart and verdict render correctly
- **Config wizard**: Open wizard → change loan/assumptions → results reflect changes
- **Share URL round-trip**: Load a shared URL → state restores correctly, results match

**Phase B: Component integration tests**

Focus on interactive components where state and UI interplay can break silently:

- `HeroSection` (orchestration: mode switching, preset selection, wizard trigger)
- `ResultSummary` (config header, stats grid, insight footer, responsive popover vs inline)
- `SalaryExplorer` (slider interaction → chart annotation update)
- `ConfigWizard` (multi-step flow, field validation, completion callback)
- `QuizContainer` (step progression, plan determination, navigation to calculator)
- `OverpayComparisonChart` + `OverpaySummaryCards` (data display correctness)

**Phase C: Accessibility and thresholds**

- Add `axe-playwright` checks to e2e tests (catch a11y regressions automatically)
- Verify focus management in wizard and modal flows
- Raise coverage thresholds to 40% as a stepping stone

### 2. Inflation Adjustment (Present Value Toggle)

All monetary values in the calculator are currently nominal (future pounds). Over a 30-year repayment, this massively overstates the real cost. A toggle to show values in today's money gives users a more honest picture.

**Why it matters:**

- A loan showing "£60k total repayment" over 30 years might be ~£35k in today's money
- The "middle earners pay the most" curve changes shape in real terms
- Overpay savings look smaller when discounted, which affects the "should I overpay?" decision
- No competitor offers this — it's a genuine differentiator

**Implementation approach:**

The engine doesn't need to change. Present value is a display-layer transformation applied to simulation output:

```
presentValue = nominalValue / (1 + discountRate) ^ (month / 12)
```

- **Discount rate input**: Default to a sensible CPI/inflation assumption (e.g., 2%). Expose as a simple input in the assumptions config, not a prominent control.
- **Global toggle**: A single switch (e.g., "Show in today's money") that applies across all charts and summary cards simultaneously. Lives in the loan context so all consumers react.
- **Affected surfaces**: Total repayment chart, balance over time chart, result summary cards (total paid, written off amount), overpay comparison chart and savings figures.
- **Chart labelling**: When toggled on, chart Y-axis labels and tooltips should indicate "in today's money" or similar. The toggle state should be visually obvious so users don't confuse nominal and real values.

### 3. Scenario Analysis Tool

A "what-if" sandbox that lets users compare how different assumptions change their loan outcome. Lives at `/scenarios` or as a dedicated section.

The simulation engine already accepts salary growth, threshold growth, RPI, and BoE rate — the feature is primarily a UI for defining, comparing, and visualising multiple scenarios.

**3a. Salary Trajectory Builder**

Replace the single salary + flat growth rate with a configurable career path:

- **Step-function builder**: Define salary for year ranges (e.g., £28k for years 1-3, £40k for years 4-8, £0 for years 9-10 career break, £55k for years 11+). Simpler than a drawable graph, works on mobile, and naturally handles career breaks and part-time.
- **Quick presets**: "Steady growth", "Fast riser", "Career break at 35", "Part-time parent" — one-click starting points that users can customise.
- **Engine change**: The simulation loop currently applies a flat `salaryGrowthRate` annually. Needs to accept a salary schedule (array of `{fromMonth, salary}` entries) and interpolate. The engine change is small; the UI is the bulk of the work.

**3b. Threshold & Rate Simulation**

Let users explore policy scenarios:

- **Threshold scenarios**: "Government freezes thresholds for 5 years" (fiscal drag — makes you pay more), "Thresholds rise with inflation" (status quo), "Thresholds cut to £20k" (worst case, has been floated politically).
- **Interest rate scenarios**: "RPI drops to 2%", "RPI stays at 3.2%", "RPI rises to 5%". For Plan 2, also model changes to the +3% cap.
- **Presets + custom**: Offer named scenarios ("Optimistic", "Status quo", "Pessimistic") that bundle threshold + rate assumptions, plus full custom control.

**Comparison UI:**

- Up to 3 scenarios side-by-side (or overlaid on a single chart with a legend)
- Each scenario shows: total repaid, months to payoff, written-off amount, monthly repayment at current salary
- Difference summary: "Scenario B costs £X more than Scenario A over Y years"

### 4. More Charts

The simulation engine produces per-loan monthly data (interest applied, repayment amount, opening/closing balance per plan) that isn't currently visualised. New charts should deepen understanding of the existing calculator results and support the new features above.

**4a. Interest vs Principal Breakdown**

Stacked area chart showing how each monthly payment splits between interest and principal reduction. Reveals that early years are almost entirely interest (especially Plan 2/Postgraduate at RPI+3%), which is the kind of insight that changes how people think about overpaying.

- Data source: `MonthSnapshot.loans[].interestApplied` and `repayment` fields already exist
- Location: Secondary chart section on the home page, below balance over time

**4b. Monthly Repayment Over Time**

Line chart showing how the monthly payment amount changes as salary grows. Useful for budgeting — "how much will I be paying in 5 years?"

- Data source: `MonthSnapshot.totalRepayment` already exists per month
- Could overlay multiple salary trajectories once scenario analysis ships

**4c. Cumulative Interest Paid**

Area chart showing total interest accumulated month-by-month. Makes the true cost of interest visceral — especially powerful when combined with the present value toggle (shows interest is even less significant in real terms).

- Data source: Running sum of `MonthSnapshot.loans[].interestApplied`

**4d. Scenario Comparison Chart**

Overlay chart showing balance over time (or total repayment by salary) for multiple scenarios. This is the visual centrepiece of the scenario analysis tool.

- Data source: Multiple simulation runs with different configs
- UI: Shared axes, colour-coded lines with legend, hover to compare values at any point

**4e. Multi-Plan Breakdown** (for users with multiple loans)

Stacked area showing each loan's balance separately over time. Currently the balance chart shows a single combined line. For users with Plan 2 + Postgraduate, showing them separately reveals which loan is more expensive and which gets written off.

- Data source: `MonthSnapshot.loans[]` per-plan data already tracked
- Conditional: Only show when user has 2+ active loans

---

## Backlog

Lower-priority ideas. Not scheduled, but worth revisiting later.

### Myth Buster Section

Interactive true/false cards debunking common misconceptions. Lightweight and shareable, but low SEO volume for "student loan myths" queries. Could be embedded within guide pages rather than standalone.

### PDF / Email Export

Personalized summary with plan type, projected repayment, and key insight. Email capture enables re-engagement when thresholds change annually. Premature until there's meaningful traffic to convert.

### Historical Rate Tracker

Show how thresholds and interest rates have changed over time. Builds trust and highlights the political dimension. Could pair well with the scenario analysis tool (show historical context for threshold freeze scenarios).

### Multiple Loan Breakdown (standalone)

Subsumed by chart 4e above. If the multi-plan breakdown chart ships as part of "More Charts", this doesn't need a separate feature.

---

## Completed

_For reference. These shipped and are live._

### Phase 1: Foundation (Done)

- **"What Plan Am I On?" quiz** — 4-step flow at `/which-plan` with region, year, course type, and postgrad questions. Determines plan and links into calculator with correct config.
- **Preset personas** — 4 one-click presets (2012-23 Grad, 2023+ Grad, Pre-2012, UG+Masters) displayed as responsive card grid with "Tailor to you" CTA.
- **Shareable results** — URL-encoded state (`?loans=PLAN_2:45000&sal=40000`), native share API with clipboard fallback, dynamic OG metadata for social previews.

### Phase 2: Core Feature (Done)

- **"Should I Overpay?" calculator** — Full page at `/overpay` with monthly overpayment slider, lump sum input, repayment date picker, comparison chart, summary cards, and verdict callout. Supports presets and URL sharing.

### Phase 3: Content & SEO (Done)

- **6 guide pages** at `/guides/*` — Plan 2 vs Plan 5, how interest works, student loan vs mortgage, pay upfront or take loan, moving abroad, self-employment. Each with interactive charts where relevant. Index page with card grid.
- **Structured footer navigation** — Sitewide links to key pages.
- **SEO titles and descriptions** — Emotional hooks for all pages.
- **Skeleton loading states** — For charts and results.
- **Accessibility fixes** — Slider labels, heading order (Lighthouse warnings resolved).
