import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  accentColor: string;
}

export function StatCard({
  label,
  value,
  subtext,
  accentColor,
}: StatCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-xl bg-card p-4 pl-3 ring-1 ring-foreground/10"
      style={{
        backgroundImage: `linear-gradient(135deg, ${accentColor}0D, transparent 60%)`,
      }}
    >
      <div
        className="absolute inset-y-2 left-0 w-1 rounded-r-full"
        style={{ backgroundColor: accentColor }}
      />
      <div className="pl-3">
        <span className="text-xs tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        <p
          className="mt-1 font-mono text-2xl font-semibold tabular-nums"
          style={{ color: accentColor }}
        >
          {value}
        </p>
        {subtext && (
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl bg-card p-4 pl-3 ring-1 ring-foreground/10">
      <div className="space-y-2 pl-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
