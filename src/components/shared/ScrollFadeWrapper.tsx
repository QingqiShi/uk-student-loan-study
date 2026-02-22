"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

function ScrollFadeWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollable = container.querySelector<HTMLElement>(
      '[data-slot="table-container"]',
    );
    if (!scrollable) return;

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollable;
      setShowFade(scrollLeft + clientWidth < scrollWidth - 1);
    };

    update();
    scrollable.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(scrollable);

    return () => {
      scrollable.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-background to-transparent transition-opacity",
          showFade ? "opacity-100" : "opacity-0",
        )}
      />
      {children}
    </div>
  );
}

export { ScrollFadeWrapper };
