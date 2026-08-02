"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  acceptCookies,
  declineCookies,
  getConsentStatus,
  getServerConsentStatus,
  initPostHog,
  subscribeConsent,
} from "@/lib/posthog";

export function CookieBanner() {
  // Consent lives in browser storage, so it reads as an external store: the
  // server snapshot renders nothing, and init below republishes the real
  // answer once PostHog is running.
  const status = useSyncExternalStore(
    subscribeConsent,
    getConsentStatus,
    getServerConsentStatus,
  );

  // See initPostHog for why this cannot run any earlier than an effect.
  useEffect(() => {
    initPostHog();
  }, []);

  if (status !== "pending") return null;

  return (
    <section
      aria-label="Cookie choice"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-3 sm:p-4"
    >
      <div className="flex w-full max-w-2xl flex-col gap-3 rounded-xl border border-rule bg-background/95 p-4 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Cookies.</span> We use
          them to see which parts of the calculator get used, and to record
          errors so we can fix them. Decline and we still count your visit —
          without cookies, and without session recordings.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="outline" onClick={declineCookies}>
            Decline
          </Button>
          <Button size="sm" onClick={acceptCookies}>
            Accept
          </Button>
        </div>
      </div>
    </section>
  );
}
