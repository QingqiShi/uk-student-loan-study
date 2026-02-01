import { FloatingHeader } from "./FloatingHeader";
import { Footer } from "./Footer";
import { HeroSection } from "./HeroSection";
import { PlanFromQuery } from "./PlanFromQuery";
import SecondaryCharts from "./SecondaryCharts";
import { ToolLinks } from "./ToolLinks";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <PlanFromQuery />
      <FloatingHeader />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-6 md:px-6 md:py-8"
      >
        <HeroSection />

        <SecondaryCharts />

        <ToolLinks />
      </main>
      <Footer />
    </div>
  );
}

export default App;
