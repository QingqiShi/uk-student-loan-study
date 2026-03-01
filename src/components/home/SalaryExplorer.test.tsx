import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SalaryExplorer } from "./SalaryExplorer";
import type { LoanState } from "@/types/store";
import type { ReactNode } from "react";
import { LoanProvider } from "@/context/LoanContext";

vi.mock("@/context/AssumptionsWizardContext", () => ({
  useAssumptionsWizard: () => ({ openAssumptions: vi.fn() }),
}));

vi.mock("@/components/charts/TotalRepaymentChart", () => ({
  TotalRepaymentChart: () => <div data-testid="chart" />,
}));

vi.mock("@/context/PersonalizedResultsContext", () => ({
  usePersonalizedResults: () => ({
    summary: null,
    insight: null,
    cards: null,
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
  it("renders the chart title", () => {
    render(<SalaryExplorer />, { wrapper: createWrapper() });

    expect(screen.getByText("Total repayment by salary")).not.toBeNull();
  });

  it("renders the chart", () => {
    render(<SalaryExplorer />, { wrapper: createWrapper() });

    expect(screen.getByTestId("chart")).not.toBeNull();
  });
});
