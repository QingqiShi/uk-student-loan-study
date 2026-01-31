"use client";

import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";
  return (
    <Card className="m-4 border-destructive">
      <CardContent className="p-6">
        <h2 className="mb-2 text-lg font-semibold text-destructive">
          Something went wrong
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">{errorMessage}</p>
        <Button onClick={resetErrorBoundary} variant="outline">
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset application state if needed
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
