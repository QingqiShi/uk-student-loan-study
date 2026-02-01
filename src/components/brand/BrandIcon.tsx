import { PRIMARY, PRIMARY_DARK } from "@/lib/brand-colors";

interface BrandIconProps {
  size?: number;
  className?: string;
}

export function BrandIcon({ size = 44, className }: BrandIconProps) {
  // Calculate corner radius proportional to size (roughly 10/44 ratio)
  const cornerRadius = Math.round((size / 44) * 10);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: cornerRadius,
        backgroundColor: PRIMARY,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path
          d="M44 44l0-20q-11-16-22-12-11 5-22 16l0 16z"
          fill={PRIMARY_DARK}
        />
      </svg>
    </div>
  );
}
