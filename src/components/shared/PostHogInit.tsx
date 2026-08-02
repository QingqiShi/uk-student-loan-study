"use client";

import { useEffect } from "react";
import { initPostHog } from "@/lib/posthog";

/** Renders nothing — see initPostHog for why this cannot run before hydration. */
export function PostHogInit() {
  useEffect(() => {
    initPostHog();
  }, []);

  return null;
}
