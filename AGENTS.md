<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Domain language

Domain terms are defined in `CONTEXT.md` — use those terms (and their spellings) in code, comments, and copy. If the user's wording is ambiguous or uses an `_Avoid_` synonym, confirm which glossary term they mean before acting.

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
- `public/llms.txt` → `generateLlmsTxt`

## UI & Styling

- Always support light and dark mode
- Icons: `@hugeicons/react` with `@hugeicons/core-free-icons` — `<HugeiconsIcon icon={Quiz01Icon} />`
- **No arbitrary Tailwind values** — use standard tokens only (`text-sm` not `text-[13px]`)
- Standard Tailwind breakpoints only (`xs`/`sm`/`md`/`lg`/`xl`/`2xl`)
- **Brand green (light):** `#0C5C44` (spruce) — used in `globals.css` (`--primary`/`--ring`), `BRAND_HEX.green` (`BrandIcon.tsx`), `icon.svg`, `manifest.json`, `scripts/generate-social-images.mjs`. Update ALL locations when changing. Note `--chart-1` → `--chart-principal` → `var(--primary)`: the data green IS the brand green (one green across the page) — do NOT fork it into a separate "data" value.
- **Brand green (dark):** `#34B08A` (spruce lifted for dark) is a separate value that must stay in sync across its own locations: `globals.css` `--primary` (dark), `BRAND_HEX.emerald` (`BrandIcon.tsx`), `icon.svg`, and `scripts/generate-social-images.mjs`.
- `dark` / `light` classes on containers scope CSS variables for that subtree
- **Headings**: Use `<Heading>` from `@/components/typography/Heading` for content headings — do not use raw `<h1>`–`<h6>` with inline classes. Sizes: `page-hero` | `page` (default) | `section` | `subsection`. Polymorphic `as` prop sets the HTML element.

## Copy

User-facing copy follows "The Field Guide to AI Slop" (ignorance.ai). The lintable parts are enforced by the local rules in `eslint-rules/slop.js` (`custom/no-slop-characters`, `custom/no-slop-phrases`, `custom/no-fragment-questions`) on every string, template literal and JSX text in `src/`, `e2e/` and `scripts/`:

- No em dashes (use a full stop, comma, colon or brackets), text arrows, tick marks, emoji or Unicode bold/italic letters. A `–` en dash is fine for ranges and as an empty-value placeholder.
- No "It's not X, it's Y" parallelism, vapid openers ("In today's..."), unearned profundity ("Here's the thing") or slop vocabulary (delve, unlock, journey, seamless...).
- No fragment-question hooks ("Not sure? Take the quiz"). Real questions as headings are fine.
- Not lintable, still expected: no snappy triads, no "X, not Y" contrast tics, no filler that restates the previous sentence, vary sentence length, use contractions.

Figure captions read `Fig. N: Title · Subtitle`.

## Code Quality

- **Do not modify ShadCN components** (`src/components/ui/`) — exceptions: auto-formatting and bug fixes (bug fixes require an explicit comment explaining the fix)

**Never use:**

- `eslint-disable`, `@ts-ignore`, `@ts-expect-error`
- `any` type or unsafe assertions (`as unknown as X`)
- `useMemo`, `useCallback`, `React.memo` — React Compiler handles this (exception: shadcn/ui)
- Barrel files — import from source modules directly
- Default exports (exception: `page.tsx` / `layout.tsx` / `src/test/environment.ts`, which vitest loads by default export)
- `Context.Provider` / `useContext` — use `<Context value={...}>` and `use(Context)` (React 19)
- Manually fix lint error that could have been fixed with `--fix`.

## Testing

- Test hooks with real `LoanProvider` using `initialStateOverride` — don't mock context with `vi.mock`

## SEO Maintenance

Update when content/structure changes:

- `public/llms.txt` — edit `generateLlmsTxt` template (auto-generated)
- `src/app/sitemap.xml` — add new routes
- JSON-LD schemas in `layout.tsx` — update FAQPage answers if plan details change
- Page metadata — update titles/descriptions if focus changes
