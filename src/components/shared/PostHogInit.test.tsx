import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PostHogInit } from "./PostHogInit";

const mocks = vi.hoisted(() => ({ init: vi.fn() }));

vi.mock("@/lib/posthog", () => ({ initPostHog: mocks.init }));

describe("PostHogInit", () => {
  beforeEach(() => {
    mocks.init.mockClear();
  });

  it("starts PostHog after mount, not before hydration", () => {
    render(<PostHogInit />);

    expect(mocks.init).toHaveBeenCalledOnce();
  });

  it("renders nothing", () => {
    const { container } = render(<PostHogInit />);

    expect(container.innerHTML).toBe("");
  });

  it("starts PostHog once per mount", () => {
    const { rerender } = render(<PostHogInit />);
    rerender(<PostHogInit />);

    expect(mocks.init).toHaveBeenCalledOnce();
  });
});
