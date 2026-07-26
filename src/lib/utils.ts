import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's stock scales. Our `@theme` type tokens
 * (`text-fig-lg`, `text-page`, `tracking-heading`, …) fall through to its
 * catch-all `text-{color}` / unknown groups, so a size and a colour in the same
 * `cn()` call read as the same group and the size is silently dropped —
 * `cn("text-fig-lg text-foreground")` returned just `text-foreground`, which
 * flattened the whole mono figure ramp to 16px. Registering the tokens in their
 * real groups is what keeps the Instrument's type scale rendering.
 *
 * Keep these lists in sync with the `--text-*` / `--tracking-*` tokens in
 * `globals.css`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "hero",
            "page",
            "section",
            "lead",
            "index",
            "micro",
            "meta",
            "body",
            "fig-sm",
            "fig-md",
            "fig-lg",
            "fig-hero",
          ],
        },
      ],
      tracking: [{ tracking: ["hero", "heading", "label"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Find the item in an array whose `salary` is closest to the target value.
 */
export function findClosestBySalary<T extends { salary: number }>(
  data: T[],
  targetSalary: number,
): T {
  return data.reduce((closest, point) =>
    Math.abs(point.salary - targetSalary) <
    Math.abs(closest.salary - targetSalary)
      ? point
      : closest,
  );
}
