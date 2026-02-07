import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useDebouncedFunction } from "./useDebouncedFunction";

describe("useDebouncedFunction", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fires only once when called multiple times within the delay window", () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useDebouncedFunction(spy, 50));

    result.current(1);
    result.current(2);
    result.current(3);

    vi.advanceTimersByTime(50);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("fires with the arguments from the last call", () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useDebouncedFunction(spy, 50));

    result.current(1);
    result.current(2);
    result.current(3);

    vi.advanceTimersByTime(50);

    expect(spy).toHaveBeenCalledWith(3);
  });

  it("does not fire before the delay elapses", () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useDebouncedFunction(spy, 50));

    result.current();

    vi.advanceTimersByTime(30);
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(20);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("does not fire after unmount", () => {
    const spy = vi.fn();
    const { result, unmount } = renderHook(() => useDebouncedFunction(spy, 50));

    result.current();
    unmount();

    vi.advanceTimersByTime(50);

    expect(spy).not.toHaveBeenCalled();
  });
});
