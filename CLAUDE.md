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

This is a UK student loan repayment calculator built with Next.js 16 (App Router), React 18, and TypeScript.

### Data Flow

1. **Store** (`src/store.ts`): Zustand store with Immer middleware handles all loan configuration state. Persists to localStorage with custom Date serialization.

2. **Store Selectors** (`src/hooks/useStoreSelectors.ts`): Extract `LoanConfig` object for calculations and current salary for annotations.

3. **Loan Calculations** (`src/utils/loan-calculations.ts`): Core simulation logic:
   - `simulateLoanRepayment()` - Main simulation loop handling Plan 2/5 and postgraduate loans
   - `generateSalaryDataSeries()` - Generates chart data by running simulations across salary range
   - `calculateAnnualizedRate()` - Computes effective interest rate from simulation results

4. **Chart Data Hooks** (`src/hooks/useChartData.ts`): Three hooks (`useTotalRepaymentData`, `useRepaymentYearsData`, `useInterestRateData`) each call `generateSalaryDataSeries` with appropriate mapper functions.

5. **Chart Components**: `TotalRepaymentChart`, `RepaymentYearsChart`, `InterestRateChart` each use their corresponding hook and render via `ChartBase`.

### Key Types

- `LoanConfig` - Loan parameters for simulation (balances, rates, dates, plan type)
- `SimulationResult` - Output of one salary simulation (payments, months, remaining balances)
- `DataPoint` - `[salary, value]` tuple for charts
- `SimulationMapper` - Function extracting chart metric from `SimulationResult`

### UI Structure

- **ConfigPanel** - Left sidebar with loan inputs (balances, rates, dates)
- **ChartsGrid** - Three Visx charts showing repayment metrics by salary
- **ChartBase** - Shared chart component using `@visx/xychart`

### Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json)

### Loan Plan Differences

- **Plan 2** (pre-2023): £2,274/month threshold, 9% rate, 30-year write-off, income-based interest
- **Plan 5** (post-2023): £2,083/month threshold, 9% rate, 40-year write-off, RPI-only interest
- **Postgraduate**: £1,750/month threshold, 6% rate, runs concurrently with undergraduate

## Code Quality Rules

**NEVER use these - they hide real errors:**

- `eslint-disable` comments (any form)
- `any` type
- `@ts-ignore` / `@ts-expect-error`
- Type assertions that bypass safety (`as unknown as X`)

If lint or TypeScript errors occur, fix the underlying issue properly. If genuinely stuck, stop and ask for guidance rather than suppressing the error.
