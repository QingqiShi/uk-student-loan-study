import colors from "./brand-colors.json";

// Re-export as named exports for TypeScript consumers
export const BRAND_COLORS = colors;

// Convenience exports for common use cases
export const PRIMARY = colors.primary.light;
export const PRIMARY_DARK = colors.primaryDark;
