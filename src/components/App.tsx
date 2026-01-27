import { lazy, Suspense } from "react";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { Skeleton } from "./ui/skeleton";

const SecondaryCharts = lazy(() => import("./SecondaryCharts"));
const AssumptionsFooter = lazy(() => import("./AssumptionsFooter"));

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-6 pb-16 md:px-6 md:py-8"
      >
        <HeroSection />

        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <SecondaryCharts />
        </Suspense>
      </main>
      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <AssumptionsFooter />
      </Suspense>
    </div>
  );
}

export default App;
