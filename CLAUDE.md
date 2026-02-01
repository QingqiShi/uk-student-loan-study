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

Fix underlying issues instead of suppressing errors.
