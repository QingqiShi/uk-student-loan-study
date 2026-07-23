"use client";

import { useSyncExternalStore } from "react";
import { formatAgo, hoursSinceLastCheck } from "@/lib/dataFreshness";

// The label is hour-bucketed, so every instance shares a single timer that
// fires on the next UTC hour boundary — when the value can actually change —
// rather than each polling every minute. useSyncExternalStore skips the
// re-render when the recomputed string is unchanged, so a boundary wake is
// cheap even in the rare case nothing moved.
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | undefined;

function schedule(): void {
  // +1s past the boundary so the recompute lands in the new hour bucket.
  timer = setTimeout(tick, 3_600_000 - (Date.now() % 3_600_000) + 1_000);
}

function tick(): void {
  for (const notify of listeners) {
    notify();
  }
  schedule();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  if (listeners.size === 1) {
    schedule();
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
}

/**
 * Live "Verified X ago" freshness label, derived client-side from the daily
 * 07:00 UTC check schedule (see `@/lib/dataFreshness`).
 *
 * `useSyncExternalStore` renders the durable "Verified recently" fallback during
 * SSR and hydration, then swaps to the relative label on the client. That keeps
 * the SSR'd HTML and the no-JS experience truthful and sidesteps a hydration
 * mismatch by design. "recently" (not "daily") is deliberate: it reads on its
 * own when the verb is hidden (see `narrow`), it stays consistent with the live
 * "X ago" recency signal, and every surface shows the same fallback word on a
 * page. The whole label is one inline span, so it stays a single flex item.
 *
 * `narrow` is for tight chrome (the header badge): it hides the "Verified" verb
 * below `sm`, dropping to just "14h ago" / "recently".
 */
export function VerifiedAgo({ narrow = false }: { narrow?: boolean }) {
  const ago = useSyncExternalStore(
    subscribe,
    () => formatAgo(hoursSinceLastCheck(new Date())),
    () => "recently",
  );

  return (
    <span>
      <span className={narrow ? "hidden sm:inline" : undefined}>
        {"Verified "}
      </span>
      {ago}
    </span>
  );
}
