import { Footer } from "./Footer";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { PlanFromQuery } from "./PlanFromQuery";
import { SecondaryCharts } from "./SecondaryCharts";
import { ToolLinks } from "./ToolLinks";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <PlanFromQuery />
      <Header />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-3 pt-18 pb-6 md:pb-8"
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
