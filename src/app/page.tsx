import App from "@/components/App";
import { AppErrorBoundary } from "@/components/ErrorBoundary";
import { LoanProvider } from "@/context/LoanContext";

export default function Home() {
  return (
    <AppErrorBoundary>
      <LoanProvider>
        <App />
      </LoanProvider>
    </AppErrorBoundary>
  );
}
