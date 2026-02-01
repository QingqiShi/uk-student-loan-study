"use client";

import { Share01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLoanContext } from "@/context/LoanContext";
import { generateShareUrl, generateShareText } from "@/lib/shareUrl";

interface ShareButtonProps {
  repaymentYear?: number;
}

export function ShareButton({ repaymentYear }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { state } = useLoanContext();

  const handleShare = () => {
    const options = { repaymentYear };
    const shareText = generateShareText(state, options);
    const shareUrl = generateShareUrl(state, options);

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch {
        // Intentional silent failure: clipboard access may be blocked in
        // some browsers/contexts. The button remains functional but without
        // feedback, which is acceptable UX for a non-critical feature.
      }
    };

    // Try native share API first (mobile)
    if (typeof navigator.share === "function") {
      navigator
        .share({
          title: "UK Student Loan Projection",
          text: shareText,
          url: shareUrl,
        })
        .catch((err: unknown) => {
          // Only fall back to clipboard if share actually failed,
          // not if user cancelled
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }
          void copyToClipboard();
        });
      return;
    }

    // Fall back to clipboard
    void copyToClipboard();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleShare}
      aria-label={copied ? "Link copied" : "Share results"}
      className="shrink-0"
    >
      <HugeiconsIcon
        icon={copied ? Tick02Icon : Share01Icon}
        className="size-4"
        strokeWidth={2}
      />
    </Button>
  );
}
