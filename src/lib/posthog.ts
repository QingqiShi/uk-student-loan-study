import posthog, { type CaptureResult } from "posthog-js";

// Both names are inlined by Next at build time, so they must be read as whole
// `process.env.X` expressions. Without them `posthog.init` never runs and every
// helper below is a no-op.
export const posthogEnabled = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

let initialised = false;

// Messages that only the browser or a browser extension sends. Add a message to
// this list when a new one comes into the PostHog inbox.
const KNOWN_BROWSER_MESSAGES: readonly RegExp[] = [
  /^Script error\.$/,
  /runtime\.sendMessage/,
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// window.onerror and unhandledrejection set handled to false on the first
// entry. posthog.captureException sets it to true, and a chained cause has no
// handled value, so a manual capture never agrees with this test.
function isAutocaptured(exceptionList: unknown[]): boolean {
  const first = exceptionList[0];
  return (
    isRecord(first) &&
    isRecord(first.mechanism) &&
    first.mechanism.handled === false
  );
}

function hasFrame(
  exceptionList: unknown[],
  matches: (frame: Record<string, unknown>) => boolean,
): boolean {
  return exceptionList.some((exception: unknown) => {
    if (!isRecord(exception) || !isRecord(exception.stacktrace)) return false;
    const frames = exception.stacktrace.frames;
    return (
      Array.isArray(frames) &&
      frames.some((frame: unknown) => isRecord(frame) && matches(frame))
    );
  });
}

function hasKnownBrowserMessage(exceptionList: unknown[]): boolean {
  return exceptionList.some((exception: unknown) => {
    if (!isRecord(exception)) return false;
    const value = exception.value;
    return (
      typeof value === "string" &&
      KNOWN_BROWSER_MESSAGES.some((message) => message.test(value))
    );
  });
}

// A removed event leaves no record, so this hook keeps an event that it cannot
// show came from another party. It removes an autocaptured exception in two
// conditions. First, the exception has stack frames, but no frame is code that
// this site loaded. Second, the exception has no stack frames, and its message
// is a known browser message.
export function dropThirdPartyExceptions(
  event: CaptureResult | null,
): CaptureResult | null {
  if (!event || event.event !== "$exception") return event;
  const exceptionList: unknown = event.properties.$exception_list;
  if (!Array.isArray(exceptionList) || !isAutocaptured(exceptionList)) {
    return event;
  }
  if (hasFrame(exceptionList, () => true)) {
    return hasFrame(exceptionList, (frame) => frame.in_app === true)
      ? event
      : null;
  }
  return hasKnownBrowserMessage(exceptionList) ? null : event;
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
