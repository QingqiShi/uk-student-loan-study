# Insight Cards + Detail Pages

## Context

Replace the standalone Balance Over Time chart on the homepage with a Vercel Dashboard-style grid of compact insight cards. Each card shows a title, key stat, sparkline, and `›` arrow linking to a dedicated detail page with the full-size interactive chart. Creates 4 new SEO-indexable routes.

```
  Your Loan Breakdown
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ Balance    › │ │ Interest   › │ │ Monthly    › │
  │ 24 years     │ │ £12.4k       │ │ £148/mo      │
  │ ~~sparkline~~│ │ ~~sparkline~~│ │ ~~sparkline~~│
  └──────────────┘ └──────────────┘ └──────────────┘
  ┌──────────────┐
  │ Cumulative › │        Grid: lg:3-col, sm:2-col, 1-col
  │ £42k total   │        Cards link to /balance, /interest, /monthly, /cumulative
  │ ~~sparkline~~│
  └──────────────┘
```

Detail pages: flat routes with breadcrumb, full-size chart, toggle controls, AssumptionsCallout, SEO metadata + JSON-LD.

---

## Milestone 1 — Homepage insight cards

Data layer + sparkline UI on the homepage. Cards link to `#` initially.

- Add `INSIGHT_CARDS` worker payload to `src/workers/simulation.worker.ts` — single `simulate()` call, derives 4 sparkline series (annual samples) + key stats
- Add `useInsightCardsData` hook (`src/hooks/useInsightCardsData.ts`) following `useBalanceOverTimeData` pattern
- Create `Sparkline` component (`src/components/charts/Sparkline.tsx`) — minimal Recharts, no axes/grid/tooltip, `h-12`
- Create `InsightCard` + `InsightCards` grid (`src/components/home/`) — hover matches `ToolCard`, responsive grid, skeleton loading
- Replace `SecondaryCharts` content with `InsightCards` grid

## Milestone 2 — Balance detail page (`/balance`)

First detail page. Establishes shared layout. Reuses existing `BalanceOverTimeChart`.

- Create `DetailPageLayout` (`src/components/shared/DetailPageLayout.tsx`) — breadcrumb, heading, description, controls slot, chart, AssumptionsCallout
- Create `src/app/balance/page.tsx` + `layout.tsx` with metadata + JSON-LD
- Wire up Balance card link + add to sitemap

## Milestone 3 — Interest detail page (`/interest`)

- Add `INTEREST_SERIES` worker payload + `generateInterestTimeSeries` utility
- Create `useInterestBreakdownData` hook + `InterestBreakdownChart` (stacked area: interest vs principal)
- Create `src/app/interest/page.tsx` + `layout.tsx` + sitemap entry

## Milestone 4 — Monthly + Cumulative detail pages

- Add `MONTHLY_SERIES` + `CUMULATIVE_SERIES` worker payloads + utilities
- Create hooks + `MonthlyRepaymentChart` (line) + `CumulativeCostChart` (area)
- Create `src/app/monthly/` + `src/app/cumulative/` routes + sitemap entries

## Milestone 5 — SEO + polish

- Update `generateLlmsTxt` template in `scripts/check-govuk-figures/templates.ts`
- Final responsive + dark/light mode checks
- Full verification: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm format`
