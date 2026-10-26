import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { LoanProvider } from "@/context/LoanContext";
import { ShareButton } from "./ShareButton";

function Wrapper({ children }: { children: ReactNode }) {
  return <LoanProvider>{children}</LoanProvider>;
}

describe("ShareButton", () => {
  beforeEach(() => {
    // Force the clipboard fallback path (no native share sheet).
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    });
  });

  it("announces copy success to screen readers via a live region", async () => {
    // Define the clipboard mock after setup(): userEvent installs its own
    // clipboard stub during setup(), which would otherwise shadow this one.
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(<ShareButton />, { wrapper: Wrapper });

    // The live region exists up front but is empty, so a repeat copy re-announces.
    const status = screen.getByRole("status");
    expect(status.textContent).toBe("");

    await user.click(screen.getByRole("button", { name: "Share results" }));

    await waitFor(() => {
      expect(status.textContent).toBe("Link copied to clipboard");
    });
    expect(writeText).toHaveBeenCalledOnce();
    // Existing icon/label feedback is preserved alongside the announcement.
    expect(screen.getByRole("button", { name: "Link copied" })).not.toBeNull();
  });

  it("keeps the live region empty when the clipboard copy fails", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockRejectedValue(new Error("blocked"));
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(<ShareButton />, { wrapper: Wrapper });

    await user.click(screen.getByRole("button", { name: "Share results" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledOnce();
    });
    expect(screen.getByRole("status").textContent).toBe("");
  });
});
