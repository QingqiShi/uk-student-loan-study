import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ConsentStatus } from "@/lib/posthog";
import { CookieBanner } from "./CookieBanner";

// A stand-in for the consent store in @/lib/posthog: the component subscribes
// to it, so answering the banner has to notify listeners to re-render.
const store = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  return {
    status: "pending",
    listeners,
    set(next: ConsentStatus) {
      store.status = next;
      for (const listener of listeners) listener();
    },
    init: vi.fn(),
    accept: vi.fn(() => {
      store.set("granted");
    }),
    decline: vi.fn(() => {
      store.set("denied");
    }),
  };
});

vi.mock("@/lib/posthog", () => ({
  initPostHog: store.init,
  getConsentStatus: () => store.status,
  getServerConsentStatus: () => "granted" as ConsentStatus,
  subscribeConsent: (listener: () => void) => {
    store.listeners.add(listener);
    return () => store.listeners.delete(listener);
  },
  acceptCookies: store.accept,
  declineCookies: store.decline,
}));

function banner() {
  return screen.queryByRole("region", { name: "Cookie choice" });
}

describe("CookieBanner", () => {
  beforeEach(() => {
    store.status = "pending";
    store.listeners.clear();
    store.init.mockClear();
    store.accept.mockClear();
    store.decline.mockClear();
  });

  it("shows while the choice is pending", () => {
    render(<CookieBanner />);

    expect(banner()).not.toBeNull();
  });

  it.each(["granted", "denied"] as const)(
    "stays hidden once the choice is %s",
    (status) => {
      store.status = status;
      render(<CookieBanner />);

      expect(banner()).toBeNull();
    },
  );

  it("starts PostHog after mount, not before hydration", () => {
    render(<CookieBanner />);

    expect(store.init).toHaveBeenCalledOnce();
  });

  it("opts in and dismisses on Accept", async () => {
    const user = userEvent.setup();
    render(<CookieBanner />);

    await user.click(screen.getByRole("button", { name: "Accept" }));

    expect(store.accept).toHaveBeenCalledOnce();
    expect(store.decline).not.toHaveBeenCalled();
    expect(banner()).toBeNull();
  });

  it("opts out and dismisses on Decline", async () => {
    const user = userEvent.setup();
    render(<CookieBanner />);

    await user.click(screen.getByRole("button", { name: "Decline" }));

    expect(store.decline).toHaveBeenCalledOnce();
    expect(store.accept).not.toHaveBeenCalled();
    expect(banner()).toBeNull();
  });
});
