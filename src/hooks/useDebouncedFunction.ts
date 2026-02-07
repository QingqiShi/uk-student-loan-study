import { useEffect, useRef } from "react";

/**
 * Returns a debounced version of `fn` that delays invocation
 * until `delay` ms after the last call.
 */
export function useDebouncedFunction<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): (...args: Args) => void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // No manual memoization — React Compiler handles stable identity.
  return (...args: Args) => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
