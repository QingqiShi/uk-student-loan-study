# CLAUDE.md

## Commands

```bash
pnpm dev           # Start dev server (expect it to be already running)
pnpm build         # Build for production
pnpm lint          # Run ESLint
pnpm format        # Format with Prettier
pnpm test          # Run tests
```

## Tech Stack

This project uses TypeScript and React 19. When making changes, ensure compatibility with React 19 patterns (no legacy context, proper use of hooks). Always run the full test suite (`pnpm test`), lint, and build after multi-file refactors.

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

## UI Development

When building UI components or design boards, always verify that content fits within its parent container boundaries. Check for overflow issues before presenting results.

Always support both light and dark mode when creating or modifying UI components and design elements. Never deliver a light-mode-only implementation unless explicitly told to.

When verifying visual elements (fonts, colors, layouts), always cross-reference the actual rendered output via browser rather than relying solely on code/variable values. Visual inspection is the source of truth for design work.

## Design System

When updating design tokens (CSS variables, color tokens, etc.), always propagate changes to ALL references including hardcoded values in brand guidelines, component swatches, and semantic color mappings. Never assume a variable change is complete until all consumers are updated.

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
- **`src/lib/loans/plans.ts`** - When GOV.UK announces threshold/rate changes, also update llms.txt key facts and interest rates
