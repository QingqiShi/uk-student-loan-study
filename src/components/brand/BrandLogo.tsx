import { BrandIcon } from "./BrandIcon";
import colors from "@/lib/brand-colors.json";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  /** "auto" adapts to theme, "dark"/"light" for fixed-background demos */
  variant?: "auto" | "dark" | "light";
  size?: "small" | "default" | "large";
  className?: string;
}

const SIZE_CONFIG = {
  small: { icon: 24, fontSize: 16, shadow: { x: 1, y: 3 }, gap: 8 },
  default: { icon: 44, fontSize: 19, shadow: { x: 2, y: 4 }, gap: 12 },
  large: { icon: 56, fontSize: 24, shadow: { x: 2, y: 5 }, gap: 14 },
} as const;

export function BrandLogo({
  variant = "auto",
  size = "default",
  className,
}: BrandLogoProps) {
  const config = SIZE_CONFIG[size];
  const { icon: iconSize, fontSize, shadow: shadowOffset, gap } = config;

  // For auto variant, use Tailwind classes for theme adaptation
  if (variant === "auto") {
    return (
      <div className={cn("flex items-center", className)} style={{ gap }}>
        <BrandIcon size={iconSize} />
        <div className="relative">
          {/* Shadow layer */}
          <span
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

  // For dark/light variants, use fixed colors for brand demos
  const textColor = variant === "dark" ? "#FFFFFF" : "#111111";

  return (
    <div className={cn("flex items-center", className)} style={{ gap }}>
      <BrandIcon size={iconSize} />
      <div className="relative">
        {/* Shadow layer */}
        <span
          className="absolute font-display font-bold whitespace-nowrap"
          style={{
            top: shadowOffset.y,
            left: shadowOffset.x,
            fontSize,
            color: `${colors.primary.light}25`,
          }}
        >
          StudentLoanStudy.uk
        </span>
        {/* Main text */}
        <span
          className="relative font-display whitespace-nowrap"
          style={{ fontSize }}
        >
          <span style={{ color: textColor }}>StudentLoan</span>
          <span className="font-bold text-primary">Study</span>
          <span className="font-bold text-muted-foreground">.uk</span>
        </span>
      </div>
    </div>
  );
}
