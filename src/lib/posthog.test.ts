import type { CaptureResult } from "posthog-js";
import { describe, it, expect } from "vitest";
import { dropThirdPartyExceptions } from "./posthog";

interface StackFrameFixture {
  platform: "web:javascript";
  filename?: string;
  function: string;
  lineno?: number;
  colno?: number;
  in_app: boolean;
}

interface ExceptionFixture {
  type: string;
  value: string;
  mechanism: {
    type: "generic";
    handled: boolean;
    synthetic: boolean;
  };
  stacktrace?: { type: "raw"; frames: StackFrameFixture[] };
}

function exceptionEvent(exceptions: ExceptionFixture[]): CaptureResult {
  return {
    uuid: "0199a5c1-0000-7000-8000-000000000000",
    event: "$exception",
    properties: {
      $exception_list: exceptions,
      $exception_level: "error",
      $current_url: `${window.location.origin}/`,
    },
  };
}

// The masked cross-origin error. window.onerror gets an empty source, so
// posthog-js coerces the message string and finds no stack.
const maskedScriptError = exceptionEvent([
  {
    type: "Error",
    value: "Script error.",
    mechanism: { type: "generic", handled: false, synthetic: true },
  },
]);

const extensionMessageError = exceptionEvent([
  {
    type: "Error",
    value: "Invalid call to runtime.sendMessage(). Tab not found.",
    mechanism: { type: "generic", handled: false, synthetic: true },
  },
]);

// Safari replaces the URL of an extension content script with this prefix, so
// every frame carries it and posthog-js marks every frame in_app false.
const maskedUrl = "webkit-masked-url://hidden/";

const contentScriptError = exceptionEvent([
  {
    type: "TypeError",
    value:
      "undefined is not an object (evaluating 'contentScriptData.init_ts')",
    mechanism: { type: "generic", handled: false, synthetic: false },
    stacktrace: {
      type: "raw",
      frames: [
        {
          platform: "web:javascript",
          filename: maskedUrl,
          function: "_next",
          lineno: 1,
          colno: 4100,
          in_app: false,
        },
        {
          platform: "web:javascript",
          filename: maskedUrl,
          function: "asyncGeneratorStep",
          lineno: 1,
          colno: 3830,
          in_app: false,
        },
        {
          platform: "web:javascript",
          filename: maskedUrl,
          function: "invoke",
          lineno: 1,
          colno: 2660,
          in_app: false,
        },
        {
          platform: "web:javascript",
          filename: maskedUrl,
          function: "tryCatch",
          lineno: 1,
          colno: 1040,
          in_app: false,
        },
        {
          platform: "web:javascript",
          filename: maskedUrl,
          function: "_callee$",
          lineno: 9,
          colno: 44,
          in_app: false,
        },
        {
          platform: "web:javascript",
          filename: maskedUrl,
          function: "printTiming",
          lineno: 4,
          colno: 120,
          in_app: false,
        },
      ],
    },
  },
]);

const unnamedFrameError = exceptionEvent([
  {
    type: "TypeError",
    value:
      "undefined is not an object (evaluating 'contentScriptData.init_ts')",
    mechanism: { type: "generic", handled: false, synthetic: false },
    stacktrace: {
      type: "raw",
      frames: [
        { platform: "web:javascript", function: "printTiming", in_app: false },
      ],
    },
  },
]);

const siteError = exceptionEvent([
  {
    type: "TypeError",
    value: "Cannot read properties of undefined (reading 'balance')",
    mechanism: { type: "generic", handled: true, synthetic: false },
    stacktrace: {
      type: "raw",
      frames: [
        {
          platform: "web:javascript",
          filename: `${window.location.origin}/_next/static/chunks/main-app.js`,
          function: "simulateLoan",
          lineno: 1,
          colno: 4242,
          in_app: true,
        },
      ],
    },
  },
]);

// posthog.captureException makes its own Error to get a stack when the thrown
// value has none. That Error comes from the posthog-js code in a _next chunk,
// so a value thrown by this site always keeps a frame on this origin.
const stringThrownBySite = exceptionEvent([
  {
    type: "Error",
    value: "a component threw a string",
    mechanism: { type: "generic", handled: true, synthetic: true },
    stacktrace: {
      type: "raw",
      frames: [
        {
          platform: "web:javascript",
          filename: `${window.location.origin}/_next/static/chunks/main-app.js`,
          function: "onError",
          lineno: 3,
          colno: 7,
          in_app: true,
        },
        {
          platform: "web:javascript",
          filename: `${window.location.origin}/_next/static/chunks/vendor.js`,
          function: "PostHog.captureException",
          lineno: 9,
          colno: 1,
          in_app: true,
        },
      ],
    },
  },
]);

// The known cost of the filter. The browser gives no stack for this rejection,
// so the site loses it with the noise.
const nonErrorRejection = exceptionEvent([
  {
    type: "UnhandledRejection",
    value: "Non-Error promise rejection captured with value: boom",
    mechanism: { type: "generic", handled: false, synthetic: true },
  },
]);

const pageviewEvent: CaptureResult = {
  uuid: "0199a5c1-0000-7000-8000-000000000001",
  event: "$pageview",
  properties: { $current_url: `${window.location.origin}/which-plan` },
};

describe("dropThirdPartyExceptions", () => {
  it("drops the masked cross-origin script error", () => {
    expect(dropThirdPartyExceptions(maskedScriptError)).toBeNull();
  });

  it("drops a frameless browser extension message", () => {
    expect(dropThirdPartyExceptions(extensionMessageError)).toBeNull();
  });

  it("drops an exception whose frames Safari masks", () => {
    expect(dropThirdPartyExceptions(contentScriptError)).toBeNull();
  });

  it("drops an exception whose frames have no filename", () => {
    expect(dropThirdPartyExceptions(unnamedFrameError)).toBeNull();
  });

  it("drops a rejected promise whose value is not an Error", () => {
    expect(dropThirdPartyExceptions(nonErrorRejection)).toBeNull();
  });

  it("keeps an exception thrown by a script on this origin", () => {
    expect(dropThirdPartyExceptions(siteError)).toBe(siteError);
  });

  it("keeps a value thrown by this site that has no stack of its own", () => {
    expect(dropThirdPartyExceptions(stringThrownBySite)).toBe(
      stringThrownBySite,
    );
  });

  it("keeps an event that is not an exception", () => {
    expect(dropThirdPartyExceptions(pageviewEvent)).toBe(pageviewEvent);
  });

  it("passes a null event through", () => {
    expect(dropThirdPartyExceptions(null)).toBeNull();
  });
});
