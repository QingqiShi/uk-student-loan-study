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

These are the highest-ROI features to work on next. They expand the site's content footprint for SEO, increase engagement, and are relatively lightweight to build.

### 1. Targeted Guide Pages (SEO + Education)

Short, scannable pages with interactive chart examples embedded. Each targets a high-search-volume question graduates actually Google.

**Priority topics:**

- "Plan 2 vs Plan 5: Which is better?"
- "Student Loan vs Mortgage: Does it affect affordability?"
- "How interest works on UK student loans" (the sliding scale confuses everyone)
- "Should I pay upfront or take the loan?" (for parents)
- "What happens if I move abroad?"
- "Student loans and self-employment"

**Format**: Concise prose + embedded interactive calculator snippets showing the answer visually. Link back to the main calculator for full exploration.

**SEO impact**: Currently only 3 indexable routes. Guide pages could 3-4x the organic surface area.

### 2. Myth Buster Section

Interactive true/false cards debunking common misconceptions. Lightweight, shareable, engaging.

**Example myths:**

- "Paying off faster saves you money" → Depends on your salary
- "Student loans affect your credit score" → No
- "You should avoid the loan if possible" → Usually wrong
- "You'll be in debt for 30 years" → Most won't repay in full — it's written off

**Implementation**: Could live as a standalone page (`/myths`) or as a section within guide pages. Cards with flip/reveal interaction.

### 3. PDF / Email Export

"Send me a summary" — captures email and provides a takeaway.

**Outputs**: Personalized summary with plan type, projected repayment, key insight (e.g., "You're in the middle earner bracket"), and a link back to the full calculator.

**Why**: Gives users a reason to engage beyond a single session. Email capture enables future re-engagement (e.g., when thresholds change annually).

---

## Future

Ambitious features that require more design and engineering investment. Worth doing eventually, but not urgent.

### 4. Salary Trajectory Builder

Replace the single salary + growth rate with a drawable career path:

- Graduate starting salary
- Peak earning years
- Part-time / career break periods
- Retirement wind-down

**Visualization**: Show how the loan balance changes over the custom trajectory. This subsumes the career break modeling feature.

### 5. Career Break / Part-Time Modeling

Let users model: "What if I take 2 years off?" or "What if I go part-time at 60%?"

**Why**: Major life decisions affect loan outcomes significantly. Could be built as a standalone feature or as part of the salary trajectory builder above.

### 6. Historical Rate Tracker

Show how thresholds and interest rates have changed over time. Builds trust and highlights the political dimension of student loans.

### 7. Multiple Loan Breakdown

For users with Plan 1 + Plan 2, or Plan 2 + Postgraduate — show each loan's repayment separately rather than combined. Helps users understand which loan costs more.

---

## Technical Improvements

Not user-facing features, but important for long-term quality.

| Area                      | Current State                                                                                             | Target                                                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Test coverage**         | Domain logic well-tested (engine, reducer, URL encoding). No integration or e2e tests. Thresholds at 20%. | Add component integration tests for key flows. Add Playwright e2e for preset → result and quiz → calculator journeys. Raise thresholds. |
| **Accessibility testing** | Good ARIA foundations, semantic HTML, skip links. No automated testing.                                   | Add jest-axe or axe-playwright to CI. Verify focus management in wizard/modal flows.                                                    |
| **Performance budgets**   | Web Worker + useTransition in place. No formal budgets.                                                   | Set bundle size and INP budgets. Monitor with Vercel Speed Insights.                                                                    |

---

## Completed

_For reference. These shipped and are live._

### Phase 1: Foundation (Done)

- **"What Plan Am I On?" quiz** — 4-step flow at `/which-plan` with region, year, course type, and postgrad questions. Determines plan and links into calculator with correct config.
- **Preset personas** — 4 one-click presets (2012-23 Grad, 2023+ Grad, Pre-2012, UG+Masters) displayed as responsive card grid with "Tailor to you" CTA.
- **Shareable results** — URL-encoded state (`?loans=PLAN_2:45000&sal=40000`), native share API with clipboard fallback, dynamic OG metadata for social previews.

### Phase 2: Core Feature (Done)

- **"Should I Overpay?" calculator** — Full page at `/overpay` with monthly overpayment slider, lump sum input, repayment date picker, comparison chart, summary cards, and verdict callout. Supports presets and URL sharing.
