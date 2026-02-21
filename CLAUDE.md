# CLAUDE.md

## Commands

```bash
pnpm dev           # Start dev server (expect it to be already running)
pnpm build         # Build for production
pnpm lint          # Run ESLint
pnpm typecheck     # Run TypeScript compiler (covers test files next build misses)
pnpm format        # Format with Prettier
pnpm test          # Run tests
pnpm test:e2e      # Run Playwright e2e tests
pnpm check:govuk   # Scrape GOV.UK and check for figure changes
```

**Before considering any change done**, run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm format`

## Tech Stack

- Next.js (App Router), React 19, TypeScript
- **Data flow**: React Context (`src/context/`) → loan simulation (`src/lib/loans/`) → chart hooks → chart components
- Plan configurations: `src/lib/loans/plans.ts`

## GOV.UK Figure Automation

Daily GitHub Action scrapes GOV.UK + Bank of England, auto-creates a PR when figures change.

Local steps:

1. `pnpm check:govuk` — scrape to `scripts/check-govuk-figures/results/scraped-data.json`
2. `pnpx tsx scripts/check-govuk-figures/update-files.ts` — compare & regenerate files

**Auto-generated files — do not edit manually** (edit templates in `scripts/check-govuk-figures/templates.ts` instead):

- `src/lib/loans/plans.ts` → `generatePlansTs`
- `src/lib/loans/plans.test.ts` → `generatePlansTestTs`
- `public/llms.txt` → `generateLlmsTxt`

## UI & Styling

- Always support light and dark mode
- Icons: `@hugeicons/react` with `@hugeicons/core-free-icons` — `<HugeiconsIcon icon={Quiz01Icon} />`
- **No arbitrary Tailwind values** — use standard tokens only (`text-sm` not `text-[13px]`)
- Standard Tailwind breakpoints only (`sm`/`md`/`lg`/`xl`/`2xl`). Exception: `min-[30rem]` for mobile-to-tablet
- **Brand green:** `#2B7F55` — used in `--primary` (light), `BRAND_HEX.green`, `icon.svg`, `scripts/generate-social-images.mjs`. Update ALL locations when changing.
- `dark` / `light` classes on containers scope CSS variables for that subtree

## Code Quality

**Never use:**

- `eslint-disable`, `@ts-ignore`, `@ts-expect-error`
- `any` type or unsafe assertions (`as unknown as X`)
- `useMemo`, `useCallback`, `React.memo` — React Compiler handles this (exception: shadcn/ui)
- Barrel files — import from source modules directly
- Default exports (exception: `page.tsx` / `layout.tsx`)
- `Context.Provider` / `useContext` — use `<Context value={...}>` and `use(Context)` (React 19)

**Lint errors:** Run `pnpm lint --fix` before manual fixes.

## Testing

- Test hooks with real `LoanProvider` using `initialStateOverride` — don't mock context with `vi.mock`

## SEO Maintenance

Update when content/structure changes:

- `public/llms.txt` — edit `generateLlmsTxt` template (auto-generated)
- `src/app/sitemap.xml` — add new routes
- JSON-LD schemas in `layout.tsx` — update FAQPage answers if plan details change
- Page metadata — update titles/descriptions if focus changes
