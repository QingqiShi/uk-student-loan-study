import App from "@/components/App";
import { AppErrorBoundary } from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
}
