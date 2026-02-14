import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AssumptionsCallout } from "./AssumptionsCallout";
import type { ReactNode } from "react";
import { LoanProvider } from "@/context/LoanContext";

const mockOpenAssumptions = vi.fn();
vi.mock("@/context/AssumptionsWizardContext", () => ({
  useAssumptionsWizard: () => ({ openAssumptions: mockOpenAssumptions }),
}));

function Wrapper({ children }: { children: ReactNode }) {
  return <LoanProvider>{children}</LoanProvider>;
}

describe("AssumptionsCallout", () => {
  beforeEach(() => {
    mockOpenAssumptions.mockReset();
  });

  it("renders assumption values in the text", () => {
    render(<AssumptionsCallout />, { wrapper: Wrapper });

    expect(screen.getByText(/salary growth/)).not.toBeNull();
    expect(screen.getByText(/thresholds/)).not.toBeNull();
    expect(screen.getByText(/RPI/)).not.toBeNull();
  });

  it("renders the 'Change assumptions' button", () => {
    const { container } = render(<AssumptionsCallout />, { wrapper: Wrapper });

    expect(
      within(container).getByRole("button", {
        name: "Change assumptions",
      }),
    ).not.toBeNull();
  });

  it("calls openAssumptions when the button is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<AssumptionsCallout />, { wrapper: Wrapper });

    await user.click(
      within(container).getByRole("button", {
        name: "Change assumptions",
      }),
    );

    expect(mockOpenAssumptions).toHaveBeenCalledOnce();
  });

  it("shows BOE base rate when Plan 1 is active", () => {
    render(<AssumptionsCallout />, {
      wrapper: ({ children }: { children: ReactNode }) => (
        <LoanProvider
          initialStateOverride={{
            loans: [{ planType: "PLAN_1", balance: 20000 }],
          }}
        >
          {children}
        </LoanProvider>
      ),
    });

    expect(screen.getByText(/base rate/)).not.toBeNull();
  });

  it("hides BOE base rate when only Plan 2 is active", () => {
    render(<AssumptionsCallout />, {
      wrapper: ({ children }: { children: ReactNode }) => (
        <LoanProvider
          initialStateOverride={{
            loans: [{ planType: "PLAN_2", balance: 40000 }],
          }}
        >
          {children}
        </LoanProvider>
      ),
    });

    expect(screen.queryByText(/base rate/)).toBeNull();
  });
});
