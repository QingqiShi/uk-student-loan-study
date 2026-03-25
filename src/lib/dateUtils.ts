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
