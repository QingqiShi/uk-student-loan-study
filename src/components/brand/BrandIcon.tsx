import { cn } from "@/lib/utils";

/** Brand hex constants — the two fixed colors used in the icon and logo. */
export const BRAND_HEX = {
  green: "#0D9668",
  emerald: "#34D399",
} as const;

interface BrandIconProps {
  size?: number;
  className?: string;
}

export function BrandIcon({ size = 44, className }: BrandIconProps) {
  // Calculate corner radius proportional to size (roughly 10/44 ratio)
  const cornerRadius = Math.round((size / 44) * 10);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        width: size,
        height: size,
        borderRadius: cornerRadius,
        backgroundColor: BRAND_HEX.emerald,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="absolute top-0 left-0"
      >
        <path
          d="M44 44l0-20q-11-16-22-12-11 5-22 16l0 16z"
          fill={BRAND_HEX.green}
        />
      </svg>
    </div>
  );
}
