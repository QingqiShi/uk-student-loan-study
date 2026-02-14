import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AssumptionsCallout } from "./AssumptionsCallout";

const mockOpenAssumptions = vi.fn();
vi.mock("@/context/AssumptionsWizardContext", () => ({
  useAssumptionsWizard: () => ({ openAssumptions: mockOpenAssumptions }),
}));

describe("AssumptionsCallout", () => {
  beforeEach(() => {
    mockOpenAssumptions.mockReset();
  });

  it("renders the descriptive text", () => {
    render(<AssumptionsCallout />);

    expect(
      screen.getByText(
        /These projections use assumptions about salary growth, inflation, and interest rates\./,
      ),
    ).not.toBeNull();
  });

  it("renders the 'See or change assumptions' button", () => {
    const { container } = render(<AssumptionsCallout />);

    expect(
      within(container).getByRole("button", {
        name: "See or change assumptions",
      }),
    ).not.toBeNull();
  });

  it("calls openAssumptions when the button is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<AssumptionsCallout />);

    await user.click(
      within(container).getByRole("button", {
        name: "See or change assumptions",
      }),
    );

    expect(mockOpenAssumptions).toHaveBeenCalledOnce();
  });
});
