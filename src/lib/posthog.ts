import posthog from "posthog-js";

// Both names are inlined by Next at build time, so they must be read as whole
// `process.env.X` expressions. Without them `posthog.init` never runs and every
// helper below is a no-op.
export const posthogEnabled = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

let initialised = false;

const listeners = new Set<() => void>();

function emitConsentChange() {
  for (const listener of listeners) listener();
}

export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Must run after hydration: posthog.init injects its remote-config script next
// to the first <script> in the document, which is the layout's JSON-LD block.
// Injecting before hydration makes React re-render the whole root.
export function initPostHog() {
  if (!posthogEnabled || initialised) return;
  initialised = true;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // Cookies only once the banner is accepted. Declining falls back to
    // PostHog's server-side hash, so visits are still counted. Needs
    // "Cookieless server hash mode" enabled in the PostHog project settings.
    cookieless_mode: "on_reject",
    capture_exceptions: true,
    capture_performance: { web_vitals: true },
    debug: process.env.NODE_ENV === "development",
  });

  emitConsentChange();
}

export type ConsentStatus = "granted" | "denied" | "pending";

/**
 * "pending" until the visitor answers the banner; PostHog holds events until
 * then. Reports "granted" before init so the banner stays hidden through
 * hydration and only appears once PostHog can actually record the answer.
 */
export function getConsentStatus(): ConsentStatus {
  if (!posthogEnabled || !initialised) return "granted";
  return posthog.get_explicit_consent_status();
}

/** Nothing is consented to on the server, so nothing renders there. */
export function getServerConsentStatus(): ConsentStatus {
  return "granted";
}

export function acceptCookies() {
  if (!posthogEnabled) return;
  posthog.opt_in_capturing();
  emitConsentChange();
}

/** Declining keeps counting the visit through PostHog's server-side hash. */
export function declineCookies() {
  if (!posthogEnabled) return;
  posthog.opt_out_capturing();
  emitConsentChange();
}

export function captureException(error: unknown) {
  if (!posthogEnabled) return;
  posthog.captureException(error);
}
