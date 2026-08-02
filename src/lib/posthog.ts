import posthog from "posthog-js";

// Both names are inlined by Next at build time, so they must be read as whole
// `process.env.X` expressions. Without them `posthog.init` never runs and every
// helper below is a no-op.
export const posthogEnabled = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

let initialised = false;

// Must run after hydration: posthog.init injects its remote-config script next
// to the first <script> in the document, which is the layout's JSON-LD block.
// Injecting before hydration makes React re-render the whole root.
export function initPostHog() {
  if (!posthogEnabled || initialised) return;
  initialised = true;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // The host above is a reverse proxy, so links into PostHog need the real
    // dashboard URL. Without this the toolbar and its links go to the proxy.
    ui_host: "https://eu.posthog.com",
    // The app navigates on the client. The default captures the first page
    // view only, which hides every move between pages.
    capture_pageview: "history_change",
    // No cookies and no browser storage, so the site needs no consent banner.
    // PostHog counts visitors with a hash it computes server-side instead.
    // Needs "Cookieless server hash mode" enabled in the PostHog project.
    cookieless_mode: "always",
    capture_exceptions: true,
    capture_performance: { web_vitals: true },
    debug: process.env.NODE_ENV === "development",
  });
}

export function captureException(error: unknown) {
  if (!posthogEnabled) return;
  posthog.captureException(error);
}
