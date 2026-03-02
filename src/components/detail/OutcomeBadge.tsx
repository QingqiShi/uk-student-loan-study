import { Badge } from "@/components/ui/badge";

type Condition = {
  when: boolean;
  label: string;
  variant: "warning" | "success";
};

interface OutcomeBadgeProps {
  conditions: Condition[];
}

export function OutcomeBadge({ conditions }: OutcomeBadgeProps) {
  const match = conditions.find((c) => c.when);
  if (!match) return null;

  return (
    <Badge
      variant="outline"
      className={
        match.variant === "warning"
          ? "rounded-md border-status-warning-border bg-status-warning text-status-warning-foreground"
          : "rounded-md border-status-success-border bg-status-success text-status-success-foreground"
      }
    >
      {match.label}
    </Badge>
  );
}
