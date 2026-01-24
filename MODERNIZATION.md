# UK Student Loan Study - Modernization Plan

## Executive Summary

This plan addresses a comprehensive modernization of the UK Student Loan Study repository across 8 phases. The migration includes:

- **Framework**: Vite → Next.js (for SSG/SSR, SEO, performance)
- **UI Library**: MUI → Tailwind CSS + ShadCN (big bang migration)
- **Code Quality**: Testing, type safety, DRY refactoring

**Current Tech Stack:** React 18.2, TypeScript 4.9, Vite 4.0, MUI 5.11, Zustand 4.3, Visx 3.0

**Target Tech Stack:** Next.js 14+, TypeScript 5.x, Tailwind CSS, ShadCN, Zustand, Visx 3.0

---

## Final State (After All Phases)

After completing all 8 phases, the codebase will have:

1. **Framework**: Next.js with App Router, deployed to Vercel
2. **Styling**: Tailwind CSS + ShadCN components (no MUI, no Emotion)
3. **Testing**: Vitest with >60% coverage, all calculation logic tested
4. **Code Quality**: DRY chart components (~50 lines each), centralized types, simplified Zustand store
5. **SEO**: Server-rendered metadata, Open Graph tags, sitemap
6. **Performance**: Smaller bundle (no MUI), SSR for faster initial load
7. **DX**: TypeScript 5.x strict mode, modern ESLint rules, auto-deploy on git push

---

## Issues & Goals

| # | Issue/Goal | Priority | Phase |
|---|------------|----------|-------|
| 1 | Zero test coverage | Critical | 1-2 |
| 2 | Code duplication (3 chart components) | Critical | 2, 7 |
| 3 | No SSG/SSR (poor SEO, slow initial load) | Critical | 5 |
| 4 | Heavy UI library (MUI bundle size) | High | 6 |
| 5 | Verbose Zustand store patterns | High | 4 |
| 6 | Type safety issues | Medium | 3 |
| 7 | No utility layer for calculations | Medium | 2 |
| 8 | Missing error handling | Low | 8 |
| 9 | Accessibility gaps | Low | 8 |

---

## Phase 1: Testing Infrastructure Foundation

**Goal:** Establish testing infrastructure without modifying application code.

**Rationale:** Testing must come first because all subsequent refactoring requires verification. Tests are framework-agnostic and will survive the Next.js migration.

### Tasks

1. **Install testing dependencies**
   ```bash
   yarn add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
   ```

2. **Create `vitest.config.ts`**
   ```typescript
   import { defineConfig } from 'vitest/config';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       setupFiles: ['./src/__tests__/setup.ts'],
       coverage: {
         provider: 'v8',
         reporter: ['text', 'html', 'lcov'],
         thresholds: { lines: 0, functions: 0, branches: 0, statements: 0 },
         include: ['src/utils/**/*.ts'],
         exclude: ['src/**/*.test.ts', 'src/__tests__/**'],
       },
     },
   });
   ```

3. **Create test setup file:** `src/__tests__/setup.ts`

4. **Update `package.json` scripts**
   ```json
   { "test": "vitest", "test:coverage": "vitest run --coverage" }
   ```

5. **Create test directory structure**
   ```
   src/__tests__/setup.ts
   src/utils/__tests__/        # Phase 2
   src/components/__tests__/   # Phase 7
   ```

### Verification
- [x] `yarn test` runs without errors
- [x] `yarn test:coverage` generates HTML report in `coverage/`
- [x] `yarn build` succeeds

---

## Phase 2: Extract and Test Core Calculation Logic

**Goal:** Extract duplicated loan calculation logic into a testable utility layer.

**Rationale:** The 70+ lines of identical calculation logic in chart components must be consolidated. This code is framework-agnostic and will transfer cleanly to Next.js.

**Important:** This phase creates the utility functions and tests them, but does NOT yet update the chart components to use them. The chart refactor happens in Phase 7 after the UI migration is complete. This minimizes risk by keeping the app working throughout.

### Critical Files
- `src/components/TotalRepaymentChart.tsx` (lines 22-144)
- `src/components/RepaymentYearsChart.tsx`
- `src/components/InterestRateChart.tsx`
- `src/constants.ts`

### Tasks

1. **Create `src/utils/loan-calculations.ts`**
   - `getPlan2Rate(salary, lowerRate, upperRate)`
   - `calculateMonthlyRepayment(monthlySalary, threshold, rate)`
   - `simulateLoanRepayment(salary, config)`
   - `generateSalaryDataSeries(config, mapFn)`

2. **Create `src/types/loan.ts`**
   ```typescript
   export interface LoanConfig {
     isPost2023: boolean;
     underGradBalance: number;
     postGradBalance: number;
     plan2LTRate: number;
     plan2UTRate: number;
     plan5Rate: number;
     postGradRate: number;
     repaymentDate: Date | null;
   }

   export interface SimulationResult {
     totalRepayment: number;
     monthsToPayoff: number;
     underGradRemaining: number;
     postGradRemaining: number;
   }
   ```

3. **Create `src/utils/formatters.ts`**

4. **Create `src/utils/__tests__/loan-calculations.test.ts`** with comprehensive test cases

5. **Update coverage thresholds to 30%**

### Verification
- [x] `yarn test:coverage` shows >90% coverage for `loan-calculations.ts`
- [x] `yarn build` succeeds
- [x] No visual changes (manual browser check)

---

## Phase 3: Type System Improvements

**Goal:** Centralize types, remove unsafe assertions.

### Critical Files
- `src/store.ts`
- `src/components/CurrencyInput.tsx` (unsafe cast lines 31-35)

### Tasks

1. **Create `src/types/` directory**
   - `store.ts` - `LoanState`, `StateSetter<T>`
   - `chart.ts` - `DataPoint`, `ChartBaseProps`
   - `input.ts` - input component props
   - `index.ts` - barrel export

2. **Fix unsafe type assertions in `CurrencyInput.tsx`**

3. **Remove empty interfaces** from chart components

4. **Re-enable ESLint rules** (`no-unused-vars`, `no-empty-interface`)

### Verification
- [x] `yarn lint` passes
- [x] `yarn build` succeeds

---

## Phase 4: Refactor Store with Modern Patterns

**Goal:** Simplify Zustand store. Store code is framework-agnostic.

### Critical Files
- `src/store.ts` (104 lines of boilerplate)

### Tasks

1. **Install immer:** `yarn add immer`

2. **Refactor store with immer + persist middleware**
   ```typescript
   export const useStore = create<LoanStore>()(
     persist(
       immer((set) => ({
         ...initialState,
         updateField: (key, value) => set((state) => { state[key] = value; }),
         reset: () => set(initialState),
       })),
       { name: 'loan-calculator-storage' }
     )
   );
   ```

3. **Create selector hooks:** `src/hooks/useStoreSelectors.ts`

4. **Add store tests**

### Verification
- [x] All tests pass
- [x] State persists across page refreshes
- [x] All form inputs work correctly

---

## Phase 5: Migrate to Next.js + Vercel

**Goal:** Replace Vite with Next.js and migrate hosting from Firebase to Vercel.

**Rationale:** Next.js provides SSR/SSG out of the box. Vercel is the native deployment platform for Next.js, offering full SSR support, edge functions, and automatic preview deployments. Firebase Hosting only supports static files, which defeats the purpose of Next.js.

### Migration Strategy

Since this is a single-page app, we'll use Next.js App Router. The calculator page will be a client component for interactivity, but the layout and metadata will be server-rendered for SEO.

**Temporary State:** After Phase 5, the app will have BOTH MUI and Tailwind installed. MUI still handles all UI components. Tailwind is installed but unused. This temporary state is resolved in Phase 6 when we swap to ShadCN.

### Manual Steps (User Must Do)

> ⚠️ **These steps require manual action and cannot be automated:**

1. **Create Vercel account** at https://vercel.com (if you don't have one)

2. **Connect GitHub repo to Vercel:**
   - Go to https://vercel.com/new
   - Import your `uk-student-loan-study` repository
   - Vercel will auto-detect Next.js settings

3. **Configure custom domain (if using studentloanstudy.uk):**
   - In Vercel dashboard → Project → Settings → Domains
   - Add `studentloanstudy.uk`
   - Update DNS records at your domain registrar:
     - Remove Firebase Hosting DNS records
     - Add Vercel's DNS records (Vercel will show you the exact values)

4. **Disable Firebase Hosting** (optional, to avoid confusion):
   - Go to Firebase Console → Hosting
   - You can leave it or delete the site

### Automated Tasks

1. **Create new Next.js project structure**
   ```bash
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
   ```

   **Note:** Run in a separate directory first, then merge files.

2. **New directory structure**
   ```
   src/
     app/
       layout.tsx          # Root layout with metadata
       page.tsx            # Main calculator page (client component)
       globals.css         # Tailwind imports
     components/           # Move existing components
     utils/                # Move existing utils
     types/                # Move existing types
     hooks/                # Move existing hooks
     lib/                  # New: shared utilities
   ```

3. **Configure Next.js** (no static export needed with Vercel)
   ```typescript
   // next.config.ts
   import type { NextConfig } from 'next';

   const nextConfig: NextConfig = {
     // Vercel handles SSR natively, no 'output: export' needed
   };

   export default nextConfig;
   ```

4. **Move and adapt files**
   - Move `src/components/`, `src/utils/`, `src/types/`, `src/hooks/`
   - Move `src/constants.ts` → `src/lib/constants.ts`
   - Move `src/store.ts` → `src/lib/store.ts`
   - Delete Vite-specific files: `vite.config.ts`, `vite-env.d.ts`, `index.html`
   - Delete Firebase files: `firebase.json`, `.firebaserc`

5. **Create `src/app/layout.tsx`**
   ```typescript
   import type { Metadata } from 'next';
   import './globals.css';

   export const metadata: Metadata = {
     title: 'UK Student Loan Study',
     description: 'Interactive tool to understand UK student loan repayment',
     openGraph: {
       title: 'UK Student Loan Study',
       description: 'Interactive tool to understand UK student loan repayment',
       url: 'https://studentloanstudy.uk',
       siteName: 'UK Student Loan Study',
       type: 'website',
     },
   };

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en" className="dark">
         <body>{children}</body>
       </html>
     );
   }
   ```

6. **Create `src/app/page.tsx`**
   ```typescript
   'use client';  // Client component for interactivity

   import { App } from '@/components/App';

   export default function Home() {
     return <App />;
   }
   ```

7. **Update `package.json` scripts**
   ```json
   {
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
     "lint": "next lint"
   }
   ```

   Note: No `deploy` script needed - Vercel deploys automatically on git push.

8. **Keep Firebase Analytics (optional)**

   If you want to keep Firebase Analytics, update `src/lib/firebase.ts`:
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getAnalytics, isSupported } from 'firebase/analytics';

   const firebaseConfig = {
     // Your existing config
   };

   export const app = initializeApp(firebaseConfig);

   // Analytics only runs in browser
   if (typeof window !== 'undefined') {
     isSupported().then((supported) => {
       if (supported) getAnalytics(app);
     });
   }
   ```

   Alternatively, consider switching to Vercel Analytics (simpler, no config needed):
   ```bash
   yarn add @vercel/analytics
   ```

9. **Configure PWA for Next.js** (optional)
   ```bash
   yarn add next-pwa
   ```

   Update `next.config.ts`:
   ```typescript
   import withPWA from 'next-pwa';

   const nextConfig = withPWA({
     dest: 'public',
     disable: process.env.NODE_ENV === 'development',
   })({});

   export default nextConfig;
   ```

10. **Update Vitest config for Next.js**

    After removing Vite, update `vitest.config.ts`:
    ```typescript
    import { defineConfig } from 'vitest/config';
    import react from '@vitejs/plugin-react';
    import tsconfigPaths from 'vite-tsconfig-paths';

    export default defineConfig({
      plugins: [react(), tsconfigPaths()],
      test: {
        environment: 'jsdom',
        setupFiles: ['./src/__tests__/setup.ts'],
        alias: { '@/': './src/' },
      },
    });
    ```

    Install: `yarn add -D vite-tsconfig-paths`

11. **Upgrade TypeScript to 5.x**

    Next.js 14+ requires TypeScript 5. The `create-next-app` command will update this automatically.

12. **Remove Firebase Hosting dependencies**
    ```bash
    yarn remove firebase-tools
    ```

### Verification
- [x] `yarn dev` starts Next.js dev server
- [x] `yarn build` succeeds
- [x] All pages render correctly
- [x] All tests pass (63 tests)
- [x] **MANUAL**: Vercel deployment succeeds (check Vercel dashboard)
- [x] **MANUAL**: Custom domain works (if configured)
- [x] SEO meta tags appear in page source (View Source)
- [ ] Lighthouse performance score improves

---

## Phase 6: Migrate UI to Tailwind + ShadCN (Big Bang)

**Goal:** Replace MUI with Tailwind CSS + ShadCN for a lighter, more customizable UI.

**Rationale:** MUI adds significant bundle size. ShadCN provides copy-paste components that integrate with Tailwind, giving full control over styling.

### Pre-requisites
- Tailwind CSS was installed in Phase 5 with Next.js setup

### Tasks

1. **Initialize ShadCN**
   ```bash
   npx shadcn@latest init
   ```

   Configuration:
   - Style: Default
   - Base color: Slate (dark theme)
   - CSS variables: Yes

2. **Install required ShadCN components**
   ```bash
   npx shadcn@latest add card input label switch accordion slider
   npx shadcn@latest add tooltip  # For chart tooltips
   ```

3. **Create component mapping plan**

   | MUI Component | ShadCN/Tailwind Replacement |
   |--------------|------------------------------|
   | `AppBar`, `Toolbar` | Custom header with Tailwind |
   | `Paper`, `Card` | `Card` from ShadCN |
   | `TextField` | `Input` + `Label` from ShadCN |
   | `Switch`, `FormControlLabel` | `Switch` + `Label` from ShadCN |
   | `Accordion` | `Accordion` from ShadCN |
   | `Typography` | Tailwind typography classes |
   | `Box`, `Container` | Tailwind flex/grid classes |
   | `Skeleton` | `Skeleton` from ShadCN |
   | `DatePicker` | Custom or use `react-day-picker` |

4. **Migrate components (all at once)**

   **Header.tsx:**
   ```typescript
   export function Header() {
     return (
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
         <div className="container flex h-14 items-center">
           <h1 className="text-lg font-semibold">UK Student Loan Study</h1>
         </div>
       </header>
     );
   }
   ```

   **Layout.tsx:**
   ```typescript
   export function Layout({ children }) {
     return (
       <div className="grid gap-6 md:grid-cols-[400px_1fr] p-4">
         {children}
       </div>
     );
   }
   ```

   **ConfigPanel.tsx:**
   ```typescript
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
   import { Input } from '@/components/ui/input';
   import { Label } from '@/components/ui/label';
   import { Switch } from '@/components/ui/switch';
   import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

   // Migrate all form controls to ShadCN equivalents
   ```

   **CurrencyInput.tsx:**
   ```typescript
   import { Input } from '@/components/ui/input';
   import { NumericFormat } from 'react-number-format';

   // Wrap ShadCN Input with NumericFormat
   ```

   **DateInput.tsx:**
   ```typescript
   import { Calendar } from '@/components/ui/calendar';
   import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
   import { Button } from '@/components/ui/button';

   // Replace MUI DatePicker with ShadCN date picker pattern
   ```

5. **Configure dark theme in Tailwind**
   ```typescript
   // tailwind.config.ts
   module.exports = {
     darkMode: 'class',
     theme: {
       extend: {
         colors: {
           background: 'hsl(var(--background))',
           foreground: 'hsl(var(--foreground))',
           // ... ShadCN CSS variables
         },
       },
     },
   };
   ```

6. **Update `globals.css` with dark theme**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   :root {
     --background: 0 0% 100%;
     --foreground: 222.2 84% 4.9%;
     /* ... */
   }

   .dark {
     --background: 222.2 84% 4.9%;
     --foreground: 210 40% 98%;
     /* ... */
   }
   ```

7. **Remove MUI dependencies**
   ```bash
   yarn remove @mui/material @mui/icons-material @mui/x-date-pickers @emotion/react @emotion/styled
   ```

8. **Add date picker components**
   ```bash
   npx shadcn@latest add calendar popover button
   ```

   Note: ShadCN's calendar uses `react-day-picker` which can work with the existing `dayjs` library (already installed). No need to add `date-fns`.

### File Changes Summary

| File | Change |
|------|--------|
| `src/components/Header.tsx` | Rewrite with Tailwind |
| `src/components/Layout.tsx` | Rewrite with Tailwind grid |
| `src/components/ConfigPanel.tsx` | Migrate to ShadCN components |
| `src/components/ChartsGrid.tsx` | Rewrite with Tailwind grid |
| `src/components/ChartBase.tsx` | Keep Visx, update container styles |
| `src/components/CurrencyInput.tsx` | Wrap ShadCN Input |
| `src/components/PercentageInput.tsx` | Wrap ShadCN Input |
| `src/components/DateInput.tsx` | Use ShadCN Calendar + Popover |
| `src/app/layout.tsx` | Remove MUI ThemeProvider |
| `src/app/globals.css` | Add ShadCN theme variables |
| `package.json` | Remove MUI, add date-fns |

### Verification
- [ ] All MUI imports removed (search for `@mui`)
- [ ] All components render correctly
- [ ] Dark theme applies correctly
- [ ] Form inputs work (currency, percentage, date, switch)
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Bundle size reduced (check with `next build` output)
- [ ] All tests pass

---

## Phase 7: Refactor Chart Components

**Goal:** Apply DRY principle using extracted utilities and new UI components.

### Critical Files
- `src/components/TotalRepaymentChart.tsx`
- `src/components/RepaymentYearsChart.tsx`
- `src/components/InterestRateChart.tsx`

### Tasks

1. **Refactor charts to use shared utilities**
   ```typescript
   import { generateSalaryDataSeries } from '@/utils/loan-calculations';
   import { useLoanConfig, useCurrentSalary } from '@/hooks/useStoreSelectors';
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

   export function TotalRepaymentChart() {
     const config = useLoanConfig();
     const salary = useCurrentSalary();
     const data = useMemo(
       () => generateSalaryDataSeries(config, (r) => r.totalRepayment),
       [config]
     );

     return (
       <Card>
         <CardHeader>
           <CardTitle>Total Repayment</CardTitle>
         </CardHeader>
         <CardContent>
           <ChartBase data={data} ... />
         </CardContent>
       </Card>
     );
   }
   ```

2. **Create `src/hooks/useAnnotationPoint.ts`**

3. **Update chart container styling for Tailwind**

4. **Add component tests**

### Verification
- [ ] All tests pass
- [ ] Visual output matches original design
- [ ] Components reduced from ~160 lines to ~50 lines

---

## Phase 8: Polish and Documentation

**Goal:** Add error handling, improve accessibility, document codebase.

### Tasks

1. **Add Error Boundary component**
   ```typescript
   'use client';

   import { ErrorBoundary } from 'react-error-boundary';

   function ErrorFallback({ error, resetErrorBoundary }) {
     return (
       <Card className="border-destructive">
         <CardContent className="p-4">
           <p className="text-destructive">Something went wrong</p>
           <Button onClick={resetErrorBoundary}>Try again</Button>
         </CardContent>
       </Card>
     );
   }
   ```

2. **Add input validation** in `src/utils/validation.ts`

3. **Improve accessibility**
   - Add ARIA labels to charts
   - Ensure proper heading hierarchy
   - Test with screen reader

4. **Add JSDoc documentation**

5. **Update README.md**
   - New tech stack documentation
   - Development setup with Next.js
   - Deployment instructions

6. **SEO optimization**
   - Add Open Graph meta tags
   - Add structured data (JSON-LD)
   - Create sitemap.xml

### Verification
- [ ] Error boundaries work correctly
- [ ] Lighthouse accessibility score > 90
- [ ] Lighthouse SEO score > 90
- [ ] README is comprehensive

---

## Risk Assessment

| Phase | Risk | Mitigation |
|-------|------|------------|
| 1 | Low | No app code changes |
| 2 | Medium | Comprehensive tests first, charts unchanged |
| 3 | Low | TypeScript catches errors |
| 4 | Medium | Tests + manual verification |
| 5 | **High** | MUI still handles UI during migration, test thoroughly |
| 6 | **High** | Complete UI swap in one session, extensive testing |
| 7 | Medium | Existing utility tests + visual QA |
| 8 | Low | Additive changes only |

---

## Dependency Changes Summary

### Removed
- `@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`
- `@emotion/react`, `@emotion/styled`
- `vite`, `@vitejs/plugin-react`, `vite-plugin-pwa`
- `firebase-tools` (Firebase Hosting CLI)
- `workbox-window` (Vite PWA)

### Added
- `next`, `next-pwa`
- `tailwindcss`, `postcss`, `autoprefixer`
- `vite-tsconfig-paths` (for Vitest path aliases)
- `@vercel/analytics` (optional, replaces Firebase Analytics)
- ShadCN components (copied to `src/components/ui/`)
- `react-day-picker` (via ShadCN calendar)
- `class-variance-authority`, `clsx`, `tailwind-merge` (ShadCN deps)

### Kept
- `react`, `react-dom`
- `zustand`, `immer`
- `@visx/xychart`, `@visx/pattern`
- `dayjs`
- `react-number-format`
- `firebase` (for Analytics only, optional)

---

## Session Checklist

Before ending each session:
- [ ] All tests pass
- [ ] `yarn build` succeeds
- [ ] App works correctly in browser
- [ ] Changes committed with descriptive message
