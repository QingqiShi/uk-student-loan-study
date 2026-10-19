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
        {/* The offset shadow is a text-shadow, not a second copy of the
            wordmark. A duplicate text layer puts the words on the page twice,
            which makes the header link fail WCAG 2.5.3 Label in Name: no
            accessible name can contain the doubled text. text-shadow also
            keeps the offset constant, because it follows each glyph and thus
            mirrors the per-segment weights on its own. */}
        <span
          className="relative font-display whitespace-nowrap"
          style={{
            fontSize,
            textShadow: `${String(shadowOffset.x)}px ${String(shadowOffset.y)}px 0 color-mix(in oklab, var(--primary) 15%, transparent)`,
          }}
        >
          <span className="text-foreground">StudentLoan</span>
          <span className="font-bold text-primary">Study</span>
          <span className="font-bold text-muted-foreground">.uk</span>
        </span>
      </div>
    </div>
  );
}
