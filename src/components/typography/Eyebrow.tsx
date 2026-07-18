import { cn } from "@/lib/utils";

type EyebrowElement = "p" | "span" | "div" | "h2" | "h3" | "h4";

/**
 * The Instrument engraved label: small uppercase sans (Archivo), tracked wide in
 * `text-muted-foreground`, optionally prefixed with a short spruce rule. Figures
 * are the only thing set in the mono face — every word, labels included, is
 * Archivo (the Figures-Are-Mono rule), so this label is deliberately sans.
 *
 * Pass `marker={false}` for dense contexts (e.g. footer columns) where the
 * spruce rule would repeat too often to feel considered.
 */
function Eyebrow({
  as: Tag = "p",
  marker = true,
  className,
  children,
  ...props
}: React.ComponentProps<"p"> & { as?: EyebrowElement; marker?: boolean }) {
  return (
    <Tag
      data-slot="eyebrow"
      className={cn(
        "flex items-center gap-2 font-sans text-xs font-semibold tracking-wider text-muted-foreground uppercase",
        className,
      )}
      {...props}
    >
      {marker && (
        <span aria-hidden="true" className="h-px w-4 shrink-0 bg-primary" />
      )}
      {children}
    </Tag>
  );
}

export { Eyebrow };
