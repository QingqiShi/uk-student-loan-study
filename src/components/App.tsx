import { HeroSection } from "./home/HeroSection";
import { SecondaryCharts } from "./home/SecondaryCharts";
import { ToolLinks } from "./home/ToolLinks";
import { Footer } from "./layout/Footer";
import { Header } from "./layout/Header";
import { AssumptionsCallout } from "./shared/AssumptionsCallout";
import { PlanFromQuery } from "./shared/PlanFromQuery";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <PlanFromQuery />
      <Header />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-3 pt-8 pb-6 sm:pt-18 md:pb-8"
      >
        <HeroSection />

        <SecondaryCharts />

        <AssumptionsCallout />

        <ToolLinks />
      </main>
      <Footer />
    </div>
  );
}

export default App;
