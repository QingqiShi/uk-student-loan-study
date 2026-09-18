import posthog, { type CaptureResult } from "posthog-js";

// Both names are inlined by Next at build time, so they must be read as whole
// `process.env.X` expressions. Without them `posthog.init` never runs and every
// helper below is a no-op.
export const posthogEnabled = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

let initialised = false;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isOwnScript(filename: unknown): boolean {
  if (typeof filename !== "string") return false;
  try {
    return new URL(filename).origin === window.location.origin;
  } catch {
    return false;
  }
}

function hasOwnScriptFrame(exceptionList: unknown): boolean {
  if (!Array.isArray(exceptionList)) return false;
  return exceptionList.some(
    (exception: unknown) =>
      isRecord(exception) &&
      isRecord(exception.stacktrace) &&
      Array.isArray(exception.stacktrace.frames) &&
      exception.stacktrace.frames.some((frame: unknown) =>
        isRecord(frame) ? isOwnScript(frame.filename) : false,
      ),
  );
}

// Browser extensions and the browser itself cause exceptions on this page.
// PostHog removes them only if a stack frame shows an extension URL. The
// exceptions this site recorded have no frames, or only frames whose URL Safari
// masks, so that test keeps them. This hook keeps an exception only if one
// frame points to a script on this origin. It also removes a rejected promise
// whose value is not an Error, because the browser gives no stack for it.
export function dropThirdPartyExceptions(
  event: CaptureResult | null,
): CaptureResult | null {
  if (!event || event.event !== "$exception") return event;
  return hasOwnScriptFrame(event.properties.$exception_list) ? event : null;
}

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
    before_send: dropThirdPartyExceptions,
    capture_performance: { web_vitals: true },
    debug: process.env.NODE_ENV === "development",
  });
}

export function captureException(error: unknown) {
  if (!posthogEnabled) return;
  posthog.captureException(error);
}
