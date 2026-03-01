import { describe, it, expect } from "vitest";
import { findClosestBySalary } from "./utils";

describe("findClosestBySalary", () => {
  const data = [
    { salary: 20_000, value: 100 },
    { salary: 30_000, value: 200 },
    { salary: 40_000, value: 300 },
    { salary: 50_000, value: 400 },
  ];

  it("returns exact match when target equals a data point", () => {
    expect(findClosestBySalary(data, 30_000)).toBe(data[1]);
  });

  it("returns closest point when target is between data points", () => {
    expect(findClosestBySalary(data, 31_000)).toBe(data[1]);
    expect(findClosestBySalary(data, 39_000)).toBe(data[2]);
  });

  it("returns first point when target is below all data points", () => {
    expect(findClosestBySalary(data, 10_000)).toBe(data[0]);
  });

  it("returns last point when target is above all data points", () => {
    expect(findClosestBySalary(data, 100_000)).toBe(data[3]);
  });

  it("returns the earlier point when target is equidistant", () => {
    // At exactly 25_000, both 20k and 30k are 5k away — reduce keeps the earlier one
    expect(findClosestBySalary(data, 25_000)).toBe(data[0]);
  });

  it("works with a single-element array", () => {
    const single = [{ salary: 42_000, rate: 5.5 }];
    expect(findClosestBySalary(single, 99_000)).toBe(single[0]);
  });
});
