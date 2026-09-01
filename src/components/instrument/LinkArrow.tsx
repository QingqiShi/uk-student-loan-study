import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

/**
 * The spruce arrow that slides on hover, shared by every Instrument link row,
 * index entry and inline call-to-action. Colour and layout come from the caller.
 */
export function LinkArrow({
  className,
  external,
}: {
  className?: string;
  /** Leaves the site: an up-right arrow that also lifts on hover. */
  external?: boolean;
}) {
  return (
    <HugeiconsIcon
      icon={external ? ArrowUpRight01Icon : ArrowRight01Icon}
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 transition-transform duration-150 ease-[ease] group-hover:translate-x-[3px] motion-reduce:transition-none",
        external && "group-hover:-translate-y-0.5",
        className,
      )}
    />
  );
}
