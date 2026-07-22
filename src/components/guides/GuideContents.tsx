"use client";

import { useEffect, useState } from "react";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { cn } from "@/lib/utils";

export interface GuideSection {
  id: string;
  label: string;
}

/**
 * The guide "On this page" contents rail. Sections (id + label) are derived
 * server-side from the article's `<Heading>` elements (see `processGuideBody` in
 * guide-parts), so the nav and its anchor links render in the initial HTML —
 * shareable `#section` URLs and crawlers work without JS. This client component
 * only adds the scroll-spy highlight and smooth-scroll enhancement on top.
 * Wide-screen wayfinding only — the parent hides it below the workspace
 * breakpoint, where the article is a single column.
 */
export function GuideContents({ sections }: { sections: GuideSection[] }) {
  const [activeId, setActiveId] = useState("");

  // Scroll-spy: the current section is the last heading whose top has crossed a
  // line just below the sticky header. Reading "last crossed" (rather than a
  // narrow intersection band) keeps the final section highlightable at the
  // bottom of the page, and lets the highlight track a click-driven scroll to
  // its target instead of needing a separate suppression timer.
  useEffect(() => {
    if (sections.length === 0) return;
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    let frame = 0;
    const sync = () => {
      frame = 0;
      const line = 100;
      let current = headings[0].id;
      for (const el of headings) {
        if (el.getBoundingClientRect().top - line <= 0) current = el.id;
        else break;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(sync);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [sections]);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  }

  if (sections.length < 2) return null;

  return (
    <nav aria-label="On this page">
      <Eyebrow as="p" marker={false}>
        On this page
      </Eyebrow>
      <ul className="mt-3 space-y-0.5 border-l border-border">
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(event) => {
                  handleClick(event, section.id);
                }}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "-ml-px block border-l py-1 pl-3.5 text-meta text-pretty no-underline transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset",
                  isActive
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
