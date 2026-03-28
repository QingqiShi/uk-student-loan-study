"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-GB">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Something went wrong</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --ge-bg: #fafafa;
                --ge-fg: #0a0a0a;
                --ge-muted: #666;
                --ge-border: #ddd;
                --ge-hover-border: #999;
              }
              @media (prefers-color-scheme: dark) {
                :root {
                  --ge-bg: #0a0a0a;
                  --ge-fg: #fafafa;
                  --ge-muted: #a1a1a1;
                  --ge-border: #333;
                  --ge-hover-border: #666;
                }
              }
              button[data-ge]:hover {
                border-color: var(--ge-hover-border);
              }
              button[data-ge]:focus-visible {
                outline: 2px solid var(--ge-fg);
                outline-offset: 2px;
              }
            `,
          }}
        />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          backgroundColor: "var(--ge-bg)",
          color: "var(--ge-fg)",
        }}
      >
        <div
          style={{ maxWidth: "28rem", padding: "1.5rem", textAlign: "center" }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--ge-muted)",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            An unexpected error prevented the page from loading. Please try
            again.
          </p>
          <button
            type="button"
            data-ge=""
            onClick={reset}
            style={{
              padding: "0.625rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              borderRadius: "0.5rem",
              border: "1px solid var(--ge-border)",
              backgroundColor: "transparent",
              color: "var(--ge-fg)",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
