"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

// Elements that participate in the tab order, used by the focus trap.
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getTabbable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => el.offsetParent !== null || el === document.activeElement);
}

interface ModalOverlayProps {
  /** Accessible name announced for the dialog. */
  label: string;
  /** Invoked when the user dismisses the dialog with Escape. */
  onClose: () => void;
  /** Extra classes for the full-screen dialog container. */
  className?: string;
  children: ReactNode;
}

/**
 * Full-screen modal dialog primitive shared by the loan-config and
 * assumptions-wizard overlays. Owns the complete modal contract: it portals
 * above the page, locks body scroll, marks the rest of the document
 * inert + aria-hidden, moves focus into the dialog on open, traps Tab within
 * it, restores focus to the trigger on close, and closes on Escape.
 *
 * Render it only while the dialog is open — mounting is "open" and unmounting
 * is "close", which is what drives focus capture/restore.
 */
export function ModalOverlay({
  label,
  onClose,
  className,
  children,
}: ModalOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [container] = useState(() =>
    typeof document === "undefined" ? null : document.createElement("div"),
  );

  useEffect(() => {
    if (!container) return;
    document.body.appendChild(container);

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Hide everything except this dialog from assistive tech + the tab order.
    const backdrop = Array.from(document.body.children)
      .filter((el) => el !== container)
      .map((el) => ({
        el,
        inert: el.getAttribute("inert"),
        ariaHidden: el.getAttribute("aria-hidden"),
      }));
    for (const { el } of backdrop) {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    }

    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      for (const { el, inert, ariaHidden } of backdrop) {
        if (inert === null) el.removeAttribute("inert");
        else el.setAttribute("inert", inert);
        if (ariaHidden === null) el.removeAttribute("aria-hidden");
        else el.setAttribute("aria-hidden", ariaHidden);
      }
      // Restore focus only after the background is interactive again.
      previouslyFocused?.focus();
      container.remove();
    };
  }, [container]);

  if (!container) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className={cn("fixed inset-0 z-50", className)}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
          return;
        }
        if (e.key !== "Tab") return;
        const el = dialogRef.current;
        if (!el) return;
        const tabbable = getTabbable(el);
        if (tabbable.length === 0) {
          e.preventDefault();
          el.focus();
          return;
        }
        const first = tabbable[0];
        const last = tabbable[tabbable.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === el)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }}
    >
      {children}
    </div>,
    container,
  );
}
