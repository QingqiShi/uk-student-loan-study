# CLAUDE.md

## Commands

```bash
pnpm dev           # Start dev server (expect it to be already running)
pnpm build         # Build for production
pnpm lint          # Run ESLint
pnpm typecheck    # Run TypeScript compiler (covers test files next build misses)
pnpm format        # Format with Prettier
pnpm test          # Run tests
pnpm test:e2e      # Run Playwright e2e tests
pnpm check:govuk   # Scrape GOV.UK and check for figure changes
```

## Tech Stack

This project uses TypeScript and React 19. When making changes, ensure compatibility with React 19 patterns (no legacy context, proper use of hooks).

**Before considering any change done**, run all five checks and confirm they pass:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm format
```

## Architecture

UK student loan repayment calculator built with Next.js (App Router), React, and TypeScript.

**Data flow**: React Context (`src/context/`) → loan simulation library (`src/lib/loans/`) → chart data hooks → chart components

**Domain knowledge**: UK student loans have different plan types with varying thresholds, interest rates, and write-off periods. Plan configurations live in `src/lib/loans/plans.ts`. A daily GitHub Action (`check-govuk-figures.yml`) scrapes GOV.UK and auto-creates a PR when figures change, updating `plans.ts`, `plans.test.ts`, and `public/llms.txt`.

**Icons**: Use `@hugeicons/react` with icons from `@hugeicons/core-free-icons`. Example:

```tsx
import { Quiz01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

<HugeiconsIcon icon={Quiz01Icon} className="size-5" />;
```

## UI Development

When building UI components or design boards, always verify that content fits within its parent container boundaries. Check for overflow issues before presenting results.

Always support both light and dark mode when creating or modifying UI components and design elements. Never deliver a light-mode-only implementation unless explicitly told to.

When verifying visual elements (fonts, colors, layouts), always cross-reference the actual rendered output via browser rather than relying solely on code/variable values. Visual inspection is the source of truth for design work.

## Design System

When updating design tokens (CSS variables, color tokens, etc.), always propagate changes to ALL references including hardcoded values in brand guidelines, component swatches, and semantic color mappings. Never assume a variable change is complete until all consumers are updated.

## Tailwind CSS

**No arbitrary values.** Always use standard Tailwind utility classes for sizing, spacing, typography, border radius, tracking, etc. Never introduce arbitrary values like `text-[13px]`, `rounded-[10px]`, or `tracking-[2px]` — use the closest standard token (`text-sm`, `rounded-lg`, `tracking-widest`). This applies to all properties, not just breakpoints.

Use built-in Tailwind breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) for responsive design. Do not introduce arbitrary breakpoint values like `min-[58rem]` — stick with the standard set for consistency. The only exception is `min-[30rem]` which is already established in the codebase for the mobile-to-tablet transition.

## Brand Colors & Theme Scoping

**Brand green:** `#2B7F55` — used as `--primary` in light mode, in `BRAND_HEX.green` (`src/components/brand/BrandIcon.tsx`), `icon.svg`, and `scripts/generate-social-images.mjs`. When changing the brand color, update ALL of these locations.

**Theme scoping with `dark` / `light` classes:** The CSS defines `:root, .light { ... }` and `.dark { ... }` blocks. Adding `class="dark"` or `class="light"` to a container scopes all CSS variables for that subtree, useful for brand demos that need to show both themes regardless of the current page theme (see `BrandGuidelinesPage.tsx`).

## Code Quality Rules

**Never use these:**

- `eslint-disable` comments
- Ignore eslint warnings
- `any` type
- `@ts-ignore` / `@ts-expect-error`
- Unsafe type assertions (`as unknown as X`)
- Manual memoization (`useMemo`, `useCallback`, `React.memo`) — React Compiler handles this automatically. Exception: auto-generated shadcn/ui components.
- Barrel files (`index.ts` re-export files) — import directly from source modules instead (e.g., `@/lib/loans/types` not `@/lib/loans`).
- Default exports — use named exports instead (e.g., `export function Header` not `export default Header`). Exception: Next.js App Router requires default exports for `page.tsx` and `layout.tsx` files.
- `Context.Provider` / `useContext` — use `<Context value={...}>` and `use(Context)` directly (React 19 pattern)

Fix underlying issues instead of suppressing errors.

## Testing

When testing hooks that consume React Context, use the real `LoanProvider` with its `initialStateOverride` prop instead of mocking the context module with `vi.mock`. This keeps tests coupled to the public API, not internal context structure.

```tsx
import { LoanProvider } from "../context/LoanContext";

function createWrapper(overrides?: Partial<LoanState>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <LoanProvider initialStateOverride={overrides}>{children}</LoanProvider>
    );
  };
}
```

## SEO Maintenance

When making changes that affect site content or structure, update the following SEO assets:

- **`public/llms.txt`** - Update if adding/removing pages or changing site purpose
- **`src/app/sitemap.xml`** - Add new routes
- **JSON-LD schemas** - Update FAQPage answers if plan details change (in layout.tsx files)
- **Metadata** - Update page titles/descriptions if content focus changes
- **`src/lib/loans/plans.ts`** - Thresholds, rates, and write-off periods are auto-updated by the GOV.UK freshness checker (`.github/workflows/check-govuk-figures.yml`). `llms.txt` is also auto-updated.
