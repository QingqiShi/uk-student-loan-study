import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { trackBoeBaseRateSelected } from "@/lib/analytics";
import { BoeBaseRateStep } from "./BoeBaseRateStep";

vi.mock("@/lib/analytics", () => ({
  trackBoeBaseRateSelected: vi.fn(),
}));

const mockUpdateField = vi.fn();
vi.mock("@/context/LoanContext", () => ({
  useLoanActions: () => ({ updateField: mockUpdateField }),
  useLoanConfigState: () => ({ boeBaseRate: 3.75 }),
}));

describe("BoeBaseRateStep", () => {
  beforeEach(() => {
    mockUpdateField.mockReset();
    vi.mocked(trackBoeBaseRateSelected).mockReset();
  });

  it("renders the title", () => {
    const { container } = render(
      <BoeBaseRateStep direction="forward" onNext={vi.fn()} />,
    );

    expect(
      within(container).getByRole("heading", {
        name: "What Bank of England base rate do you expect?",
      }),
    ).not.toBeNull();
  });

  it("renders all 4 preset options", () => {
    const { container } = render(
      <BoeBaseRateStep direction="forward" onNext={vi.fn()} />,
    );

    const radios = within(container).getAllByRole("radio");
    expect(radios).toHaveLength(4);

    const labels = radios.map((r) => r.textContent).join("|");
    expect(labels).toContain("2%");
    expect(labels).toContain("3%");
    expect(labels).toContain("3.75%");
    expect(labels).toContain("5.25%");
  });

  it("clicking a preset calls updateField and trackBoeBaseRateSelected", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <BoeBaseRateStep direction="forward" onNext={vi.fn()} />,
    );

    const radios = within(container).getAllByRole("radio");
    const threePercentOption = radios.find(
      (r) => r.querySelector(".block.font-medium")?.textContent === "3%",
    );

    if (threePercentOption === undefined) {
      throw new Error("Could not find the 3% option");
    }

    await user.click(threePercentOption);

    expect(trackBoeBaseRateSelected).toHaveBeenCalledWith(3);
    expect(mockUpdateField).toHaveBeenCalledWith("boeBaseRate", 3);
  });

  it("shows 'Next' button by default", () => {
    const { container } = render(
      <BoeBaseRateStep direction="forward" onNext={vi.fn()} />,
    );

    expect(
      within(container).getByRole("button", { name: "Next" }),
    ).not.toBeNull();
  });

  it("shows 'Done' button when done prop is true", () => {
    const { container } = render(
      <BoeBaseRateStep direction="forward" onNext={vi.fn()} done />,
    );

    expect(
      within(container).getByRole("button", { name: "Done" }),
    ).not.toBeNull();
  });

  it("clicking Next calls onNext", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    const { container } = render(
      <BoeBaseRateStep direction="forward" onNext={onNext} />,
    );

    await user.click(within(container).getByRole("button", { name: "Next" }));

    expect(onNext).toHaveBeenCalledOnce();
  });
});
