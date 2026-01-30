# Feature Planning: UK Student Loan Calculator

## Current State

Your app has a **strong differentiator**: the visualization showing how middle earners pay the most. This "loan trap" insight isn't prominently featured by competitors - most focus on dry calculations rather than the emotional/financial impact.

**Current features:**

- 3 interactive charts (Total Repayment, Years to Pay, Effective Interest Rate)
- Salary slider with real-time annotations
- Plan 2 vs Plan 5 toggle
- Undergraduate + Postgraduate loan inputs
- Personalized insights (low/middle/high earner callouts)
- Dark mode

---

## Competitor Landscape

| Competitor                         | Strengths                                                    | Weaknesses                                 |
| ---------------------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| **MoneySavingExpert**              | Trusted brand, educational content, Martin Lewis videos      | Calculator lacks visual appeal, text-heavy |
| **studentloancalculator.uk**       | Multiple specialized calculators (overpayment, early payoff) | Generic UI, no differentiation             |
| **studentfinancecalculator.co.uk** | Plan finder tool, career break modeling                      | Complex interface                          |
| **mystudentloancalc.co.uk**        | Overpay vs invest comparison                                 | Limited visualization                      |

**Gap in market**: No one does visualization-first education well. Most are dry forms with numbers.

---

## Feature Suggestions

### Tier 1: High Impact, Aligned with Vision

#### 1. "Should I Overpay?" Calculator

Shows whether voluntary overpayments help or hurt you.

**Why it matters**: This is the #1 misunderstood topic. High earners benefit from overpaying; most don't.

**Inputs**: Current balance, salary, expected salary growth, savings interest rate
**Outputs**:

- Side-by-side comparison: Overpay vs Invest
- Break-even salary threshold
- Visualization of wealth outcomes over time

**Differentiator**: Show a chart comparing net worth trajectories (overpay path vs invest path)

#### 2. Preset Personas / Quick Profiles

One-click profiles for common scenarios.

**Suggestions**:

- "Typical 3-year undergrad" (£45k debt, Plan 5)
- "Postgrad add-on" (UG + PG loans)
- "Legacy grad" (Plan 2, started 2015)
- "Scottish student" (Plan 4)
- "NHS/Teacher" (lower salary growth curve)
- "Tech/Finance" (higher salary growth curve)

**Implementation**: Presets populate the form fields + salary slider

#### 3. "What Plan Am I On?" Tool

Simple quiz: When did you start? Where? What course?

**Why**: Many people genuinely don't know their plan type. Competitors have this but it's buried.

#### 4. Shareable Results

Generate a unique URL or image summarizing someone's situation:

- "I'm in the middle earner trap - I'll pay £X more than someone earning £20k more"
- Great for social sharing and virality

**Why**: Your visualization tells a compelling story - let users share that story.

#### 5. Email Summary / PDF Export

"Send me a summary" - captures email + provides value

---

### Tier 2: Content & Education

#### 6. Targeted Guide Pages (SEO + Education)

**High-value topics** (based on search volume and confusion):

- "Student Loan vs Mortgage: Does it affect affordability?"
- "Plan 2 vs Plan 5: Which is better?"
- "Should I pay upfront or take the loan?" (for parents)
- "How interest works on UK student loans" (the sliding scale is confusing)
- "What happens if I move abroad?"
- "Student loans and self-employment"

**Format**: Short, scannable pages with your charts embedded as interactive examples.

#### 7. Myth Buster Section

Interactive true/false cards debunking common misconceptions:

- "Paying off faster saves you money" → Depends on salary
- "Student loans affect your credit score" → No
- "You should avoid the loan if possible" → Usually wrong

---

### Tier 3: Advanced Calculator Features

#### 8. Career Break / Part-Time Modeling

Let users model: "What if I take 2 years off for kids?" or "What if I go part-time?"

**Why**: Major life decisions affect loan outcomes significantly.

#### 9. Salary Trajectory Builder

Instead of single salary, let users draw/define their expected career path:

- Graduate starting salary
- Peak earning years
- Retirement/wind-down

**Visualization**: Show how the loan balance changes over this custom trajectory.

#### 10. Multiple Loan Comparison

For users with Plan 1 + Plan 2, or Plan 2 + Postgraduate - show combined repayment strategy.

(Note: You already support UG + PG, but could expand to show them separately)

#### 11. Historical Rate Tracker

Show how thresholds and interest rates have changed over time - builds trust and shows the political dimension.

---

## Recommended Priorities

**Target audience**: Graduates (repayments, overpayment decisions)

### Phase 1: Foundation

1. **"What Plan Am I On?" quiz** - Simple entry point, captures confused visitors
   - Quick 3-question flow: When did you start? Where? UG or PG?
   - Links into the main calculator with correct plan pre-selected

2. **Preset personas** - One-click profiles for common graduate scenarios
   - "Plan 2 grad (2015-2023)" - £45k debt, Plan 2
   - "New Plan 5 grad" - £50k+ debt, Plan 5, 40-year term
   - "Legacy Plan 1" - Pre-2012, lower threshold
   - "UG + Postgrad combo" - Both loan types

3. **Shareable results** - Virality engine
   - Generate shareable URL with encoded state
   - Social preview image showing the "middle earner trap" visualization
   - Copy-to-clipboard button with pre-written share text

### Phase 2: Core Feature

4. **"Should I Overpay?" calculator** - The key question for graduates

   **Inputs:**
   - Current balance
   - Monthly overpayment amount (slider: £0-£500)
   - Expected salary growth (conservative/moderate/aggressive)
   - Alternative: savings interest rate you could earn instead

   **Outputs (your visualization-first approach):**
   - Chart: "Net worth over time" - two lines (overpay path vs invest path)
   - Break-even salary (above this, overpaying helps)
   - Total paid in each scenario
   - Clear verdict: "For you: Invest instead" or "For you: Overpay"

   **Differentiator**: Show the emotional impact - "By investing instead, you'd have £X more at age 50"

### Phase 3: Future Expansion

5. **Guide pages** - For SEO and education
6. **Salary trajectory builder** - Model career path
7. **Career break modeling** - What if I go part-time?

---

## Implementation Notes

### "What Plan Am I On?" Quiz

```
Question 1: When did you start your course?
- Before September 2012 → Plan 1 (England/Wales) or Plan 4 (Scotland)
- September 2012 - July 2023 → Plan 2
- August 2023 onwards → Plan 5

Question 2: Where did you study?
- England → Plan 1/2/5 (based on Q1)
- Scotland → Plan 4
- Wales → Plan 1/2/5
- Northern Ireland → Plan 1

Question 3: Was this undergraduate or postgraduate?
- Undergrad → Use plan from Q1/Q2
- Postgrad (Master's/PhD loan) → Postgraduate plan
```

### Preset Personas Data

| Persona                 | UG Balance | PG Balance | Plan   | Start Year |
| ----------------------- | ---------- | ---------- | ------ | ---------- |
| Plan 2 grad (2015-2023) | £45,000    | £0         | Plan 2 | 2018       |
| New Plan 5 grad         | £50,000    | £0         | Plan 5 | 2026       |
| Legacy Plan 1           | £20,000    | £0         | Plan 1 | 2010       |
| UG + Postgrad combo     | £45,000    | £12,000    | Plan 2 | 2018       |

### "Should I Overpay?" Calculator

Key insight to visualize: Most Plan 2/5 graduates won't fully repay before write-off. Overpaying gives the government free money.

**Decision tree:**

1. Calculate: Will you repay in full before write-off?
   - Simulate with expected salary trajectory
   - If NO → "Don't overpay, invest instead"
   - If YES → Compare interest rate vs savings rate

2. For those who will repay:
   - Loan interest rate > savings rate → Overpay
   - Loan interest rate < savings rate → Invest
