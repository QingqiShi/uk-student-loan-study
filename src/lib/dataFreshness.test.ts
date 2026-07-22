import { describe, expect, it } from "vitest";

import {
  CHECK_HOUR_UTC,
  formatAgo,
  hoursSinceLastCheck,
} from "./dataFreshness";

describe("hoursSinceLastCheck", () => {
  it("counts from today's 07:00 UTC once it has passed", () => {
    // 13:00 UTC, same day → 6h since the 07:00 run.
    expect(hoursSinceLastCheck(new Date("2026-07-22T13:00:00Z"))).toBe(6);
  });

  it("is 0 exactly at the scheduled run time", () => {
    expect(hoursSinceLastCheck(new Date("2026-07-22T07:00:00Z"))).toBe(0);
  });

  it("floors partial hours", () => {
    // 1h30m after the run → floored to 1.
    expect(hoursSinceLastCheck(new Date("2026-07-22T08:30:00Z"))).toBe(1);
  });

  it("falls back to yesterday's run before today's 07:00", () => {
    // 06:59 UTC → last run was yesterday 07:00, i.e. 23h ago.
    expect(hoursSinceLastCheck(new Date("2026-07-22T06:59:00Z"))).toBe(23);
  });

  it("never exceeds 23 hours (daily cadence)", () => {
    for (let h = 0; h < 24; h++) {
      const now = new Date(Date.UTC(2026, 6, 22, h, 30));
      const result = hoursSinceLastCheck(now);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(23);
    }
  });

  it("is timezone-independent (duration, not wall-clock)", () => {
    // Same instant, expressed with an offset, yields the same elapsed hours.
    const utc = hoursSinceLastCheck(new Date("2026-07-22T13:00:00Z"));
    const withOffset = hoursSinceLastCheck(
      new Date("2026-07-22T14:00:00+01:00"),
    );
    expect(withOffset).toBe(utc);
  });

  it("uses the documented 07:00 UTC schedule", () => {
    expect(CHECK_HOUR_UTC).toBe(7);
  });
});

describe("formatAgo", () => {
  it("formats hours compactly", () => {
    expect(formatAgo(6)).toBe("6h ago");
    expect(formatAgo(1)).toBe("1h ago");
    expect(formatAgo(23)).toBe("23h ago");
  });

  it("handles the first hour after a check", () => {
    expect(formatAgo(0)).toBe("<1h ago");
  });
});
