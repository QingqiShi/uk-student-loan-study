import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Find the item in an array whose `salary` is closest to the target value.
 */
export function findClosestBySalary<T extends { salary: number }>(
  data: T[],
  targetSalary: number,
): T {
  return data.reduce((closest, point) =>
    Math.abs(point.salary - targetSalary) <
    Math.abs(closest.salary - targetSalary)
      ? point
      : closest,
  );
}
