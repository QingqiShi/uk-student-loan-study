import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SalaryExplorer } from "./SalaryExplorer";
import type { LoanState } from "@/types/store";
import type { ReactNode } from "react";
import type { Mock } from "vitest";
import { LoanProvider } from "@/context/LoanContext";

const mockOpenAssumptions: Mock = vi.fn();
vi.mock("@/context/AssumptionsWizardContext", () => ({
  useAssumptionsWizard: () => ({ openAssumptions: mockOpenAssumptions }),
}));

vi.mock("./TotalRepaymentChart", () => ({
  TotalRepaymentChart: () => <div data-testid="chart" />,
}));

vi.mock("@/hooks/useResultSummary", () => ({
  useResultSummary: () => ({
    totalPaid: 60000,
    monthlyRepayment: 200,
    monthsToPayoff: 300,
  }),
}));

function createWrapper(overrides?: Partial<LoanState>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <LoanProvider
        initialStateOverride={{
          salary: 45_000,
          loans: [{ planType: "PLAN_2", balance: 50_000 }],
          ...overrides,
        }}
      >
        {children}
      </LoanProvider>
    );
  };
}

describe("SalaryExplorer", () => {
  beforeEach(() => {
    mockOpenAssumptions.mockReset();
  });

  it("renders the salary amount", () => {
    render(<SalaryExplorer />, { wrapper: createWrapper() });

    expect(screen.getByText("£45,000")).not.toBeNull();
  });

  it("calls openAssumptions when 'Update growth assumption' is clicked", async () => {
    const user = userEvent.setup();
    render(<SalaryExplorer />, { wrapper: createWrapper() });

    const triggers = screen.getAllByLabelText("Salary growth info");
    await user.click(triggers[0]);

    const updateButton = await screen.findByRole("button", {
      name: /Update growth assumption/,
    });
    await user.click(updateButton);

    expect(mockOpenAssumptions).toHaveBeenCalledOnce();
  });
});
