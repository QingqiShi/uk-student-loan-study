/**
 * Data-freshness signal derived from the daily GOV.UK figure check.
 *
 * The check runs on a GitHub Actions cron at 07:00 UTC every day
 * (`.github/workflows/check-govuk-figures.yml`). We do not commit a real
 * "last checked" timestamp — the automation only commits when a figure
 * *changes* — so we derive "verified X ago" from the known schedule instead:
 * the most recent 07:00 UTC that has already passed.
 *
 * Accepted trade-off: this asserts the *scheduled* run time, not a confirmed
 * completion. On a day the scrape fails, or GitHub delays/skips the run, the
 * derived time is optimistic. The workflow opens a tracking issue on failure,
 * so those days are caught in the repo even though the UI cannot know.
 */

/**
 * Hour of day (UTC) the daily figure check is scheduled to run. Must stay in
 * sync with the cron in `.github/workflows/check-govuk-figures.yml` (`0 7 * * *`)
 * — the two are not linked, so change both together if the schedule moves.
 */
export const CHECK_HOUR_UTC = 7;

/** The most recent scheduled check time (07:00 UTC) at or before `now`. */
function lastScheduledCheck(now: Date): Date {
  const candidate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      CHECK_HOUR_UTC,
    ),
  );
  if (candidate.getTime() > now.getTime()) {
    // Today's run has not happened yet — the last one was yesterday.
    candidate.setUTCDate(candidate.getUTCDate() - 1);
  }
  return candidate;
}

/**
 * Whole hours since the last scheduled check. Always 0–23, because the check
 * runs daily — so the signal never reads "days ago", reinforcing the cadence.
 */
export function hoursSinceLastCheck(now: Date): number {
  const diffMs = now.getTime() - lastScheduledCheck(now).getTime();
  return Math.floor(diffMs / 3_600_000);
}

/**
 * Relative "X ago" tail for the last check, without a verb — callers prepend
 * "Verified " in a separate element so it can be hidden on narrow chrome. The
 * value is always 0–23 hours (daily cadence), so the compact "6h ago" form is
 * all that is ever rendered.
 */
export function formatAgo(hours: number): string {
  if (hours <= 0) {
    return "<1h ago";
  }
  return `${String(hours)}h ago`;
}
