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

// Safari replaces the URL of an extension content script with this prefix, so
// every frame carries it and posthog-js marks every frame in_app false.
const maskedUrl = "webkit-masked-url://hidden/";

function maskedFrame(
  name: string,
  lineno: number,
  colno: number,
): StackFrameFixture {
  return {
    platform: "web:javascript",
    filename: maskedUrl,
    function: name,
    lineno,
    colno,
    in_app: false,
  };
}

function ownScriptFrame(name: string): StackFrameFixture {
  return {
    platform: "web:javascript",
    filename: `${window.location.origin}/_next/static/chunks/main-app.js`,
    function: name,
    lineno: 1,
    colno: 4242,
    in_app: true,
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

const contentScriptError = exceptionEvent([
  {
    type: "TypeError",
    value:
      "undefined is not an object (evaluating 'contentScriptData.init_ts')",
    mechanism: { type: "generic", handled: false, synthetic: false },
    stacktrace: {
      type: "raw",
      frames: [
        maskedFrame("_next", 1, 4100),
        maskedFrame("asyncGeneratorStep", 1, 3830),
        maskedFrame("invoke", 1, 2660),
        maskedFrame("tryCatch", 1, 1040),
        maskedFrame("_callee$", 9, 44),
        maskedFrame("printTiming", 4, 120),
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

// The browser gives no stack for a rejection whose value is not an Error, and
// its message names nothing third party, so it stays.
const nonErrorRejection = exceptionEvent([
  {
    type: "UnhandledRejection",
    value: "Non-Error promise rejection captured with value: boom",
    mechanism: { type: "generic", handled: false, synthetic: true },
  },
]);

const unknownStacklessError = exceptionEvent([
  {
    type: "Error",
    value: "Cannot read properties of undefined (reading 'threshold')",
    mechanism: { type: "generic", handled: false, synthetic: true },
  },
]);

const siteError = exceptionEvent([
  {
    type: "TypeError",
    value: "Cannot read properties of undefined (reading 'balance')",
    mechanism: { type: "generic", handled: false, synthetic: false },
    stacktrace: {
      type: "raw",
      frames: [ownScriptFrame("simulateLoan")],
    },
  },
]);

// PostHog serves its lazy bundles from another origin. An https frame is
// in_app, so an error inside one of them stays.
const posthogBundleError = exceptionEvent([
  {
    type: "TypeError",
    value: "undefined is not an object (evaluating 'r.stack')",
    mechanism: { type: "generic", handled: false, synthetic: false },
    stacktrace: {
      type: "raw",
      frames: [
        {
          platform: "web:javascript",
          filename:
            "https://f.studentloanstudy.uk/static/exception-autocapture.js",
          function: "wrapOnError",
          lineno: 1,
          colno: 880,
          in_app: true,
        },
      ],
    },
  },
]);

// Safari masks blob and eval'd page code the same way it masks an extension, so
// a masked stack that still names one loaded script stays.
const mixedFrameError = exceptionEvent([
  {
    type: "TypeError",
    value: "Cannot read properties of undefined (reading 'plan')",
    mechanism: { type: "generic", handled: false, synthetic: false },
    stacktrace: {
      type: "raw",
      frames: [
        maskedFrame("tryCatch", 1, 1040),
        ownScriptFrame("simulateLoan"),
      ],
    },
  },
]);

const manualScriptErrorCapture = exceptionEvent([
  {
    type: "Error",
    value: "Script error.",
    mechanism: { type: "generic", handled: true, synthetic: true },
  },
]);

const malformedExceptionList: CaptureResult = {
  uuid: "0199a5c1-0000-7000-8000-000000000002",
  event: "$exception",
  properties: {
    $exception_list: "Script error.",
    $exception_level: "error",
  },
};

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

  it("drops an exception whose only frame has no filename", () => {
    expect(dropThirdPartyExceptions(unnamedFrameError)).toBeNull();
  });

  it("keeps a rejected promise whose value is not an Error", () => {
    expect(dropThirdPartyExceptions(nonErrorRejection)).toBe(nonErrorRejection);
  });

  it("keeps an autocaptured error with no stack and an unknown message", () => {
    expect(dropThirdPartyExceptions(unknownStacklessError)).toBe(
      unknownStacklessError,
    );
  });

  it("keeps an exception thrown by a script on this origin", () => {
    expect(dropThirdPartyExceptions(siteError)).toBe(siteError);
  });

  it("keeps an exception from a PostHog bundle on another origin", () => {
    expect(dropThirdPartyExceptions(posthogBundleError)).toBe(
      posthogBundleError,
    );
  });

  it("keeps a masked stack that still has one in_app frame", () => {
    expect(dropThirdPartyExceptions(mixedFrameError)).toBe(mixedFrameError);
  });

  it("keeps a manual capture whose value is a known browser message", () => {
    expect(dropThirdPartyExceptions(manualScriptErrorCapture)).toBe(
      manualScriptErrorCapture,
    );
  });

  it("keeps an exception whose list is malformed", () => {
    expect(dropThirdPartyExceptions(malformedExceptionList)).toBe(
      malformedExceptionList,
    );
  });

  it("keeps an event that is not an exception", () => {
    expect(dropThirdPartyExceptions(pageviewEvent)).toBe(pageviewEvent);
  });

  it("passes a null event through", () => {
    expect(dropThirdPartyExceptions(null)).toBeNull();
  });
});
