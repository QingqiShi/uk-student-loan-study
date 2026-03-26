import { cn } from "@/lib/utils";
import { BrandIcon, type BrandIconSize } from "./BrandIcon";

interface BrandLogoProps {
  size?: Extract<BrandIconSize, "sm" | "default" | "xl">;
  className?: string;
}

const SIZE_CONFIG = {
  sm: { fontSize: 16, shadow: { x: 1, y: 3 }, gap: 8 },
  default: { fontSize: 19, shadow: { x: 2, y: 4 }, gap: 12 },
  xl: { fontSize: 24, shadow: { x: 2, y: 5 }, gap: 14 },
} as const;

export function BrandLogo({ size = "default", className }: BrandLogoProps) {
  const { fontSize, shadow: shadowOffset, gap } = SIZE_CONFIG[size];

  return (
    <div className={cn("flex items-center", className)} style={{ gap }}>
      <BrandIcon size={size} />
      <div className="relative">
        {/* Shadow layer — decorative, hidden from screen readers */}
        <span
          aria-hidden="true"
          className="absolute font-display font-bold whitespace-nowrap text-primary/15"
          style={{
            top: shadowOffset.y,
            left: shadowOffset.x,
            fontSize,
          }}
        >
          StudentLoanStudy.uk
        </span>
        {/* Main text */}
        <span
          className="relative font-display whitespace-nowrap"
          style={{ fontSize }}
        >
          <span className="text-foreground">StudentLoan</span>
          <span className="font-bold text-primary">Study</span>
          <span className="font-bold text-muted-foreground">.uk</span>
        </span>
      </div>
    </div>
  );
}
