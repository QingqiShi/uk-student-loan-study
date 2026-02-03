/**
 * Calculates the number of whole months elapsed between a start date and now.
 * Compares year/month components only, ignoring the day.
 */
export function monthsElapsedSince(
  start: Date,
  now: Date = new Date(),
): number {
  return (
    (now.getFullYear() - start.getFullYear()) * 12 +
    now.getMonth() -
    start.getMonth()
  );
}

/**
 * Formats a date as "Month Day, Year" (e.g., "January 15, 2024").
 */
export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
