import { Badge } from "@/components/ui/badge";

interface OutcomeBadgeProps {
  writtenOff: boolean;
  writtenOffLabel: string;
  aheadOfSchedule: boolean;
}

export function OutcomeBadge({
  writtenOff,
  writtenOffLabel,
  aheadOfSchedule,
}: OutcomeBadgeProps) {
  if (writtenOff) {
    return (
      <Badge
        variant="outline"
        className="rounded-md border-status-warning-border bg-status-warning text-status-warning-foreground"
      >
        Written off {writtenOffLabel}
      </Badge>
    );
  }

  if (aheadOfSchedule) {
    return (
      <Badge
        variant="outline"
        className="rounded-md border-status-success-border bg-status-success text-status-success-foreground"
      >
        Paid in full — ahead of schedule
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="rounded-md border-status-success-border bg-status-success text-status-success-foreground"
    >
      Paid in full
    </Badge>
  );
}
