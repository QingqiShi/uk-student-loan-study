import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoanProvider } from "@/context/LoanContext";
import {
  AssumptionsWizardProvider,
  useAssumptionsWizard,
} from "./AssumptionsWizardContext";

// --- Mocks ---

vi.mock("@/lib/analytics", () => ({
  trackWizardStarted: vi.fn(),
  trackWizardCompleted: vi.fn(),
}));

vi.mock("@/components/wizard/AssumptionsWizard", () => ({
  AssumptionsWizard: ({
    onComplete,
    onClose,
  }: {
    onComplete: () => void;
    onClose: () => void;
  }) => (
    <div data-testid="assumptions-wizard">
      <button onClick={onClose}>Close</button>
      <button onClick={onComplete}>Complete</button>
    </div>
  ),
}));

// Re-import mocked functions so we can assert on them
const { trackWizardStarted, trackWizardCompleted } =
  await import("@/lib/analytics");

// --- Helpers ---

function TestConsumer() {
  const { openAssumptions } = useAssumptionsWizard();
  return (
    <button
      onClick={() => {
        openAssumptions();
      }}
    >
      Open
    </button>
  );
}

function renderWithProviders(ui: ReactNode) {
  return render(<LoanProvider>{ui}</LoanProvider>);
}

// --- Tests ---

describe("AssumptionsWizardContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "";
  });

  it("throws when useAssumptionsWizard is used outside provider", () => {
    // Suppress React error boundary noise
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useAssumptionsWizard())).toThrow(
      "useAssumptionsWizard must be used within an AssumptionsWizardProvider",
    );

    spy.mockRestore();
  });

  it("returns an openAssumptions function", () => {
    const { result } = renderHook(() => useAssumptionsWizard(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <LoanProvider>
          <AssumptionsWizardProvider>{children}</AssumptionsWizardProvider>
        </LoanProvider>
      ),
    });

    expect(typeof result.current.openAssumptions).toBe("function");
  });

  it("renders a dialog when openAssumptions is called", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AssumptionsWizardProvider>
        <TestConsumer />
      </AssumptionsWizardProvider>,
    );

    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByText("Open"));

    expect(screen.queryByRole("dialog")).not.toBeNull();
  });

  it("removes the dialog when close is triggered", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AssumptionsWizardProvider>
        <TestConsumer />
      </AssumptionsWizardProvider>,
    );

    await user.click(screen.getByText("Open"));
    expect(screen.queryByRole("dialog")).not.toBeNull();

    await user.click(screen.getByText("Close"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("removes the dialog when complete is triggered", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AssumptionsWizardProvider>
        <TestConsumer />
      </AssumptionsWizardProvider>,
    );

    await user.click(screen.getByText("Open"));
    expect(screen.queryByRole("dialog")).not.toBeNull();

    await user.click(screen.getByText("Complete"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("locks body overflow when dialog is open", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AssumptionsWizardProvider>
        <TestConsumer />
      </AssumptionsWizardProvider>,
    );

    await user.click(screen.getByText("Open"));

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body overflow when dialog is closed", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AssumptionsWizardProvider>
        <TestConsumer />
      </AssumptionsWizardProvider>,
    );

    await user.click(screen.getByText("Open"));
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(screen.getByText("Close"));
    expect(document.body.style.overflow).toBe("");
  });

  it("calls trackWizardStarted with 'assumptions' on open", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AssumptionsWizardProvider>
        <TestConsumer />
      </AssumptionsWizardProvider>,
    );

    await user.click(screen.getByText("Open"));

    expect(trackWizardStarted).toHaveBeenCalledWith("assumptions");
    expect(trackWizardStarted).toHaveBeenCalledTimes(1);
  });

  it("calls trackWizardCompleted with 'assumptions' on complete", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AssumptionsWizardProvider>
        <TestConsumer />
      </AssumptionsWizardProvider>,
    );

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByText("Complete"));

    expect(trackWizardCompleted).toHaveBeenCalledWith("assumptions");
    expect(trackWizardCompleted).toHaveBeenCalledTimes(1);
  });

  it("does not call analytics when closing without completing", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AssumptionsWizardProvider>
        <TestConsumer />
      </AssumptionsWizardProvider>,
    );

    await user.click(screen.getByText("Open"));

    // Reset mocks after open (which fires trackWizardStarted)
    vi.clearAllMocks();

    await user.click(screen.getByText("Close"));

    expect(trackWizardStarted).not.toHaveBeenCalled();
    expect(trackWizardCompleted).not.toHaveBeenCalled();
  });
});
