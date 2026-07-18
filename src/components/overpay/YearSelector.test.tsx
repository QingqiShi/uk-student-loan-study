import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  trackOverpayYearSelected,
  trackOverpayDecadeNavigated,
} from "@/lib/analytics";
import { YearSelector } from "./YearSelector";

vi.mock("@/lib/analytics", () => ({
  trackOverpayYearSelected: vi.fn(),
  trackOverpayDecadeNavigated: vi.fn(),
}));

// UK repayments start on 6 April, matching createDateFromYear in the component.
function yearDate(year: number): Date {
  return new Date(year, 3, 6);
}

function getPopoverContent(): HTMLElement {
  const content = document.querySelector<HTMLElement>(
    '[data-slot="popover-content"]',
  );
  if (content === null) {
    throw new Error("Popover content is not open");
  }
  return content;
}

describe("YearSelector", () => {
  beforeEach(() => {
    vi.mocked(trackOverpayYearSelected).mockReset();
    vi.mocked(trackOverpayDecadeNavigated).mockReset();
  });

  it("trigger label reflects the current value", () => {
    render(
      <YearSelector
        id="year"
        label="Year"
        value={yearDate(2027)}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("2027")).not.toBeNull();
  });

  it("opens on the decade containing the selected year after value changes externally", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <YearSelector
        id="year"
        label="Year"
        value={yearDate(2020)}
        onChange={vi.fn()}
      />,
    );

    // The value changes externally to a year in a different decade, e.g. a
    // shared link decoding repaymentYear=2032 after mount.
    rerender(
      <YearSelector
        id="year"
        label="Year"
        value={yearDate(2032)}
        onChange={vi.fn()}
      />,
    );

    // Before the popover opens the trigger is the only element showing "2032".
    await user.click(screen.getByText("2032"));

    const content = getPopoverContent();
    // Grid resynced to the 2030s so the selection is visible on open.
    expect(within(content).getByText("2030-2039")).not.toBeNull();

    // The selected year is present in the grid and rendered with the
    // highlighted (default) variant.
    const selected = within(content).getByRole("button", { name: "2032" });
    expect(selected.className).toContain("bg-primary");
  });

  it("keeps Previous/Next decade navigation working while open", async () => {
    const user = userEvent.setup();
    render(
      <YearSelector
        id="year"
        label="Year"
        value={yearDate(2025)}
        onChange={vi.fn()}
      />,
    );

    await user.click(screen.getByText("2025"));

    let content = getPopoverContent();
    expect(within(content).getByText("2020-2029")).not.toBeNull();

    await user.click(
      within(content).getByRole("button", { name: "Next decade" }),
    );
    content = getPopoverContent();
    expect(within(content).getByText("2030-2039")).not.toBeNull();
    expect(trackOverpayDecadeNavigated).toHaveBeenCalledWith("next");

    await user.click(
      within(content).getByRole("button", { name: "Previous decade" }),
    );
    content = getPopoverContent();
    expect(within(content).getByText("2020-2029")).not.toBeNull();
    expect(trackOverpayDecadeNavigated).toHaveBeenCalledWith("previous");
  });

  it("selecting a year fires onChange and analytics with the chosen year", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <YearSelector
        id="year"
        label="Year"
        value={yearDate(2025)}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByText("2025"));

    const content = getPopoverContent();
    await user.click(within(content).getByRole("button", { name: "2028" }));

    expect(trackOverpayYearSelected).toHaveBeenCalledWith(2028);
    expect(onChange).toHaveBeenCalledTimes(1);
    const selectedDate = onChange.mock.calls[0]?.[0] as Date;
    expect(selectedDate.getFullYear()).toBe(2028);
  });

  it("disables years outside the MIN_YEAR/MAX_YEAR bounds", async () => {
    const user = userEvent.setup();
    render(
      <YearSelector
        id="year"
        label="Year"
        value={yearDate(2035)}
        onChange={vi.fn()}
      />,
    );

    await user.click(screen.getByText("2035"));

    const content = getPopoverContent();
    // 2035 is MAX_YEAR; the 2030s grid also renders 2036-2040, which must be
    // disabled.
    expect(
      within(content).getByRole("button", { name: "2036" }),
    ).toHaveProperty("disabled", true);
  });
});
