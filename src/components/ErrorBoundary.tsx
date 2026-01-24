'use client';

import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  return (
    <Card className="border-destructive m-4">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-destructive mb-2">
          Something went wrong
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          {errorMessage}
        </p>
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
