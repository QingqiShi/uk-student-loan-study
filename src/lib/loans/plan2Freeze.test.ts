import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  computePlan2FreezeSchedule,
  PLAN_2_FREEZE_TARGET,
  PLAN_2_FREEZE_END_YEAR,
} from "./plan2Freeze";

describe("plan2Freeze constants", () => {
  it("exports the frozen annual threshold", () => {
    expect(PLAN_2_FREEZE_TARGET).toBe(29_385);
  });

  it("exports the freeze end tax year", () => {
    expect(PLAN_2_FREEZE_END_YEAR).toBe(2030);
  });
});

describe("computePlan2FreezeSchedule", () => {
  const expectedMonthlyThreshold = 29_385 / 12;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 4 years of freeze when current tax year is 2025 (2025/26)", () => {
    // 15 June 2025 → tax year 2025/26
    // Next tax year = 2026/27, freeze ends 2030 → 2030 - 2026 = 4 years
    vi.setSystemTime(new Date("2025-06-15"));
    const schedule = computePlan2FreezeSchedule();
    expect(schedule).toHaveLength(4);
    expect(schedule).toEqual(
      Array.from({ length: 4 }, () => expectedMonthlyThreshold),
    );
  });

  it("returns 3 years of freeze when current tax year is 2026 (2026/27)", () => {
    // 15 June 2026 → tax year 2026/27
    // Next tax year = 2027/28, freeze ends 2030 → 2030 - 2027 = 3 years
    vi.setSystemTime(new Date("2026-06-15"));
    const schedule = computePlan2FreezeSchedule();
    expect(schedule).toHaveLength(3);
    expect(schedule).toEqual(
      Array.from({ length: 3 }, () => expectedMonthlyThreshold),
    );
  });

  it("returns 1 year of freeze when current tax year is 2028 (2028/29)", () => {
    // 15 June 2028 → tax year 2028/29
    // Next tax year = 2029/30, freeze ends 2030 → 2030 - 2029 = 1 year
    vi.setSystemTime(new Date("2028-06-15"));
    const schedule = computePlan2FreezeSchedule();
    expect(schedule).toHaveLength(1);
    expect(schedule).toEqual([expectedMonthlyThreshold]);
  });

  it("returns empty array when current tax year is 2029 (2029/30 — last freeze year)", () => {
    // 15 June 2029 → tax year 2029/30
    // Next tax year = 2030/31, freeze ends 2030 → 2030 - 2030 = 0
    vi.setSystemTime(new Date("2029-06-15"));
    const schedule = computePlan2FreezeSchedule();
    expect(schedule).toHaveLength(0);
  });

  it("returns empty array when current tax year is past the freeze (2030/31)", () => {
    // 15 June 2030 → tax year 2030/31
    vi.setSystemTime(new Date("2030-06-15"));
    const schedule = computePlan2FreezeSchedule();
    expect(schedule).toHaveLength(0);
  });

  describe("UK tax year boundary (6 April)", () => {
    it("5 April is still in the previous tax year", () => {
      // 5 April 2026 → still tax year 2025/26
      // Next tax year = 2026/27, freeze ends 2030 → 4 years
      vi.setSystemTime(new Date("2026-04-05"));
      const schedule = computePlan2FreezeSchedule();
      expect(schedule).toHaveLength(4);
    });

    it("6 April starts the new tax year", () => {
      // 6 April 2026 → tax year 2026/27
      // Next tax year = 2027/28, freeze ends 2030 → 3 years
      vi.setSystemTime(new Date("2026-04-06"));
      const schedule = computePlan2FreezeSchedule();
      expect(schedule).toHaveLength(3);
    });

    it("1 January is still in the previous tax year", () => {
      // 1 January 2027 → still tax year 2026/27
      // Next tax year = 2027/28, freeze ends 2030 → 3 years
      vi.setSystemTime(new Date("2027-01-01"));
      const schedule = computePlan2FreezeSchedule();
      expect(schedule).toHaveLength(3);
    });
  });

  it("all entries use the correct monthly threshold value", () => {
    vi.setSystemTime(new Date("2025-06-15"));
    const schedule = computePlan2FreezeSchedule();
    for (const value of schedule) {
      expect(value).toBe(expectedMonthlyThreshold);
    }
  });
});
