import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import { LoanProvider } from "@/context/LoanContext";
import type { LoanState } from "@/types/store";
import { SalaryExplorer } from "./SalaryExplorer";

vi.mock("@/components/charts/TotalRepaymentChart", () => ({
  TotalRepaymentChart: () => <div data-testid="chart" />,
}));

function Wrapper({
  children,
  overrides,
}: {
  children: ReactNode;
  overrides?: Partial<LoanState>;
}) {
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
}

function createWrapper(overrides?: Partial<LoanState>) {
  return ({ children }: { children: ReactNode }) => (
    <Wrapper overrides={overrides}>{children}</Wrapper>
  );
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
