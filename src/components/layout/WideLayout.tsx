import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SHELL_MAX } from "@/lib/layout";

/**
 * The full-bleed Instrument shell: the wide sticky header, an ultra-wide-capped
 * `<main>` that lets its section children own their fluid gutters and hairline
 * seams, and the wide footer.
 *
 * This is the landing/index-page counterpart to {@link PageLayout} — where that
 * is the narrow `max-w-4xl` reading column for prose and detail pages, this is
 * the edge-to-edge shell the homepage uses. Index pages (the homepage `App`,
 * the guides index) share it so the wide shell lives in exactly one place
 * instead of being re-typed per page.
 */
export function WideLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main
        id="main-content"
        className={`mx-auto w-full ${SHELL_MAX} flex-auto`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
