# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev           # Start Next.js development server (http://localhost:3000)
pnpm build         # Build for production
pnpm lint          # Run ESLint
pnpm format        # Format code with Prettier
pnpm format:check  # Check formatting without modifying files
pnpm test          # Run tests in watch mode
pnpm test:coverage # Run tests with coverage report
```

Do not run `pnpm dev` unless otherwise told to, expect a dev server to be already running during development.

Run a single test file:

```bash
pnpm test src/utils/__tests__/loan-calculations.test.ts
```

## Architecture

This is a UK student loan repayment calculator built with Next.js 16 (App Router), React 19, and TypeScript.

### Data Flow

1. **Store** (`src/store.ts`): Zustand store with Immer middleware handles loan configuration state (`underGradPlanType`, `underGradBalance`, `postGradBalance`, `repaymentDate`, `salary`).

2. **Store Selectors** (`src/hooks/useStoreSelectors.ts`): Builds `Loan[]` array from store state for calculations, plus current salary for annotations.

3. **Loan Library** (`src/lib/loans/`): Core loan modeling logic:
   - `plans.ts` - Configuration values for all UK loan plans (easy to update annually)
   - `interest.ts` - Interest rate calculations per plan type
   - `simulate.ts` - `simulateLoans()` runs repayment simulation
   - `types.ts` - Type definitions (`PlanType`, `Loan`, `SimulationResult`, etc.)

4. **Chart Utilities** (`src/utils/loan-calculations.ts`): Thin wrapper providing chart-specific functions:
   - `generateSalaryDataSeries()` - Generates chart data by running simulations across salary range
   - `calculateAnnualizedRate()` - Computes effective interest rate from simulation results

5. **Chart Data Hooks** (`src/hooks/useChartData.ts`): Three hooks (`useTotalRepaymentData`, `useRepaymentYearsData`, `useInterestRateData`) each call `generateSalaryDataSeries` with appropriate mapper functions.

6. **Insights** (`src/hooks/usePersonalizedInsight.ts`, `src/utils/insights.ts`): Generate personalized insights based on user's salary and loan configuration.

7. **Chart Components**: `TotalRepaymentChart`, `RepaymentYearsChart`, `InterestRateChart` each use their corresponding hook and render via `ChartBase`.

### Key Types (from `src/lib/loans/`)

- `PlanType` - Union of all plan types: `"PLAN_1" | "PLAN_2" | "PLAN_4" | "PLAN_5" | "POSTGRADUATE"`
- `Loan` - `{ planType, balance }` for a single loan
- `SimulationResult` - Output with `loanResults[]`, `totalRepayment`, `totalMonths`
- `LoanResult` - Per-loan result with `totalPaid`, `monthsToPayoff`, `remainingBalance`, `writtenOff`
- `DataPoint` - `{ salary, value }` object for charts
- `SimulationMapper` - Function extracting chart metric from `SimulationResult`

### UI Structure

- **App** - Main layout with Header, HeroSection, SecondaryCharts, and AssumptionsFooter
- **HeroSection** - Primary content area with TotalRepaymentChart, QuickInputs, and InsightCallout
- **SecondaryCharts** - Repayment years and interest rate charts
- **QuickInputs** - Inline controls for salary, loan balance, and plan type
- **InsightCallout** - Personalized insight based on user's inputs
- **ChartBase** - Shared chart component using Recharts with Shadcn styling

### Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json)

### Loan Plan Differences

All plan configurations are in `src/lib/loans/plans.ts` (update annually when GOV.UK announces changes):

- **Plan 1** (pre-2012): 25-year write-off, min(RPI, BoE+1%) interest
- **Plan 2** (2012-2023): 30-year write-off, sliding scale interest (RPI to RPI+3%)
- **Plan 4** (Scotland): 30-year write-off, min(RPI, BoE+1%) interest
- **Plan 5** (post-2023): 40-year write-off, RPI-only interest
- **Postgraduate**: 30-year write-off, RPI+3% interest, 6% repayment rate, runs concurrently

## Code Quality Rules

**NEVER use these - they hide real errors:**

- `eslint-disable` comments (any form)
- `any` type
- `@ts-ignore` / `@ts-expect-error`
- Type assertions that bypass safety (`as unknown as X`)

If lint or TypeScript errors occur, fix the underlying issue properly. If genuinely stuck, stop and ask for guidance rather than suppressing the error.

## Documentation Maintenance

When making changes that affect architecture, dependencies, or UI structure:

- Update this CLAUDE.md file to reflect those changes
- Keep framework/library versions accurate
- Document new components, hooks, or utilities
- Remove references to deleted or deprecated code
