import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import { PresetPills } from "./PresetPills";
import { AssumptionsWizardProvider } from "@/context/AssumptionsWizardContext";
import { LoanProvider } from "@/context/LoanContext";
import { type Loan } from "@/lib/loans/types";
import { PRESETS } from "@/lib/presets";

function createWrapper(loans?: Loan[]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <LoanProvider initialStateOverride={loans ? { loans } : undefined}>
        <AssumptionsWizardProvider>{children}</AssumptionsWizardProvider>
      </LoanProvider>
    );
  };
}

const noop = vi.fn();

describe("PresetPills", () => {
  it('shows "Edit configuration" when hasPersonalized is true and config is non-preset', () => {
    const customLoans: Loan[] = [{ planType: "PLAN_2", balance: 30_000 }];
    render(
      <PresetPills
        hasPersonalized={true}
        onPresetApplied={noop}
        onPersonalise={noop}
      />,
      { wrapper: createWrapper(customLoans) },
    );

    const buttons = screen.getAllByText("Edit configuration");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('shows "Tailor to you" when hasPersonalized is false', () => {
    render(
      <PresetPills
        hasPersonalized={false}
        onPresetApplied={noop}
        onPersonalise={noop}
      />,
      { wrapper: createWrapper() },
    );

    const buttons = screen.getAllByText("Tailor to you");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("highlights the matching preset button when config matches a preset", () => {
    const plan2Grad = PRESETS.find((p) => p.id === "plan2-grad");
    expect(plan2Grad).toBeDefined();
    render(
      <PresetPills
        hasPersonalized={false}
        onPresetApplied={noop}
        onPersonalise={noop}
      />,
      { wrapper: createWrapper(plan2Grad?.loans) },
    );

    const pressedButtons = screen.getAllByRole("button", { pressed: true });
    const presetButton = pressedButtons.find(
      (btn) => btn.textContent && btn.textContent.includes("2012"),
    );
    expect(presetButton).toBeDefined();
  });

  it("highlights no preset when config is custom", () => {
    const customLoans: Loan[] = [{ planType: "PLAN_2", balance: 30_000 }];
    render(
      <PresetPills
        hasPersonalized={true}
        onPresetApplied={noop}
        onPersonalise={noop}
      />,
      { wrapper: createWrapper(customLoans) },
    );

    // All preset buttons should have aria-pressed=false
    for (const preset of PRESETS) {
      const regex = new RegExp(preset.label.replace(/[–+]/g, "."));
      const buttons = screen.getAllByRole("button", { name: regex });
      for (const button of buttons) {
        expect(button.getAttribute("aria-pressed")).toBe("false");
      }
    }
  });
});
