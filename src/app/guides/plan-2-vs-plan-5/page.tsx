import { Plan2VsPlan5Guide } from "@/components/guides/plan-2-vs-plan-5/Plan2VsPlan5Guide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function Plan2VsPlan5Route() {
  return (
    <AppErrorBoundary>
      <Plan2VsPlan5Guide />
    </AppErrorBoundary>
  );
}
