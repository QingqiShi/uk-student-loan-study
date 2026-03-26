import { describe, expect, it } from "vitest";
import { monthsElapsedSince } from "./dateUtils";

describe("monthsElapsedSince", () => {
  it("returns 0 for the same month and year", () => {
    const start = new Date(2024, 3, 15); // April 2024
    const now = new Date(2024, 3, 20); // April 2024
    expect(monthsElapsedSince(start, now)).toBe(0);
  });

  it("returns 1 for one month later", () => {
    const start = new Date(2024, 0, 1); // Jan 2024
    const now = new Date(2024, 1, 1); // Feb 2024
    expect(monthsElapsedSince(start, now)).toBe(1);
  });

  it("returns 12 for one year later", () => {
    const start = new Date(2024, 0, 1); // Jan 2024
    const now = new Date(2025, 0, 1); // Jan 2025
    expect(monthsElapsedSince(start, now)).toBe(12);
  });

  it("returns correct months across year boundary", () => {
    const start = new Date(2024, 10, 1); // Nov 2024
    const now = new Date(2025, 2, 1); // Mar 2025
    expect(monthsElapsedSince(start, now)).toBe(4);
  });

  it("ignores the day component", () => {
    const start = new Date(2024, 0, 31); // Jan 31
    const now = new Date(2024, 1, 1); // Feb 1
    expect(monthsElapsedSince(start, now)).toBe(1);
  });

  it("returns negative when start is in the future", () => {
    const start = new Date(2025, 5, 1); // June 2025
    const now = new Date(2025, 2, 1); // March 2025
    expect(monthsElapsedSince(start, now)).toBe(-3);
  });

  it("handles multi-year spans", () => {
    const start = new Date(2020, 3, 1); // April 2020
    const now = new Date(2025, 3, 1); // April 2025
    expect(monthsElapsedSince(start, now)).toBe(60);
  });

  it("handles the typical repayment start scenario", () => {
    // Repayment starts April 2023, checking in March 2026
    const start = new Date(2023, 3, 1); // April 2023
    const now = new Date(2026, 2, 1); // March 2026
    expect(monthsElapsedSince(start, now)).toBe(35);
  });
});
