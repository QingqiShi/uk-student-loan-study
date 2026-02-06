# CLAUDE.md

## Commands

```bash
pnpm dev           # Start dev server (expect it to be already running)
pnpm build         # Build for production
pnpm lint          # Run ESLint
pnpm format        # Format with Prettier
pnpm test          # Run tests
```

## Architecture

UK student loan repayment calculator built with Next.js (App Router), React, and TypeScript.

**Data flow**: React Context (`src/context/`) → loan simulation library (`src/lib/loans/`) → chart data hooks → chart components

**Domain knowledge**: UK student loans have different plan types with varying thresholds, interest rates, and write-off periods. Plan configurations in `src/lib/loans/plans.ts` should be updated annually when GOV.UK announces changes.

**Icons**: Use `@hugeicons/react` with icons from `@hugeicons/core-free-icons`. Example:

```tsx
import { Quiz01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

<HugeiconsIcon icon={Quiz01Icon} className="size-5" />;
```

## Code Quality Rules

**Never use these:**

- `eslint-disable` comments
- `any` type
- `@ts-ignore` / `@ts-expect-error`
- Unsafe type assertions (`as unknown as X`)
- Manual memoization (`useMemo`, `useCallback`, `React.memo`) — React Compiler handles this automatically. Exception: auto-generated shadcn/ui components.
- Barrel files (`index.ts` re-export files) — import directly from source modules instead (e.g., `@/lib/loans/types` not `@/lib/loans`).
- Default exports — use named exports instead (e.g., `export function Header` not `export default Header`). Exception: Next.js App Router requires default exports for `page.tsx` and `layout.tsx` files.
- `Context.Provider` / `useContext` — use `<Context value={...}>` and `use(Context)` directly (React 19 pattern)

Fix underlying issues instead of suppressing errors.

## SEO Maintenance

When making changes that affect site content or structure, update the following SEO assets:

- **`public/llms.txt`** - Update if adding/removing pages or changing site purpose
- **`src/app/sitemap.xml`** - Add new routes
- **JSON-LD schemas** - Update FAQPage answers if plan details change (in layout.tsx files)
- **Metadata** - Update page titles/descriptions if content focus changes
- **`src/lib/loans/plans.ts`** - When GOV.UK announces threshold/rate changes, also update llms.txt key facts and interest rates
