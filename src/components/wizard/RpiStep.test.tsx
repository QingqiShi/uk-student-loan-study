import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RpiStep } from "./RpiStep";
import { trackRpiRateSelected } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({
  trackRpiRateSelected: vi.fn(),
}));

const mockUpdateField = vi.fn();
vi.mock("@/context/LoanContext", () => ({
  useLoanActions: () => ({ updateField: mockUpdateField }),
  useLoanConfigState: () => ({ rpiRate: 3.2 }),
}));

describe("RpiStep", () => {
  beforeEach(() => {
    mockUpdateField.mockReset();
    vi.mocked(trackRpiRateSelected).mockReset();
  });

  it("renders the title", () => {
    const { container } = render(
      <RpiStep direction="forward" onNext={vi.fn()} />,
    );

    expect(
      within(container).getByRole("heading", {
        name: "What RPI rate do you expect?",
      }),
    ).not.toBeNull();
  });

  it("renders all 4 preset options", () => {
    const { container } = render(
      <RpiStep direction="forward" onNext={vi.fn()} />,
    );

    const radios = within(container).getAllByRole("radio");
    expect(radios).toHaveLength(4);

    const labels = radios.map((r) => r.textContent);
    expect(labels.some((t) => t.includes("0%"))).toBe(true);
    expect(labels.some((t) => t.includes("2%"))).toBe(true);
    expect(labels.some((t) => t.includes("3.2%"))).toBe(true);
    expect(labels.some((t) => t.includes("5%"))).toBe(true);
  });

  it("clicking a preset calls updateField and trackRpiRateSelected", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <RpiStep direction="forward" onNext={vi.fn()} />,
    );

    const radios = within(container).getAllByRole("radio");
    const twoPercentOption = radios.find((r) => r.textContent.startsWith("2%"));
    expect(twoPercentOption).toBeDefined();
    if (twoPercentOption) {
      await user.click(twoPercentOption);
    }

    expect(mockUpdateField).toHaveBeenCalledWith("rpiRate", 2);
    expect(trackRpiRateSelected).toHaveBeenCalledWith(2);
  });

  it("shows 'Next' button by default", () => {
    const { container } = render(
      <RpiStep direction="forward" onNext={vi.fn()} />,
    );

    expect(
      within(container).getByRole("button", { name: "Next" }),
    ).not.toBeNull();
  });

  it("shows 'Done' button when done prop is true", () => {
    const { container } = render(
      <RpiStep direction="forward" onNext={vi.fn()} done />,
    );

    expect(
      within(container).getByRole("button", { name: "Done" }),
    ).not.toBeNull();
  });

  it("clicking Next calls onNext", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    const { container } = render(
      <RpiStep direction="forward" onNext={onNext} />,
    );

    await user.click(within(container).getByRole("button", { name: "Next" }));

    expect(onNext).toHaveBeenCalledOnce();
  });
});
