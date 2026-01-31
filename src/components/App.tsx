import { FloatingHeader } from "./FloatingHeader";
import { Footer } from "./Footer";
import { HeroSection } from "./HeroSection";
import SecondaryCharts from "./SecondaryCharts";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <FloatingHeader />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-6 md:px-6 md:py-8"
      >
        <HeroSection />

        <SecondaryCharts />
      </main>
      <Footer />
    </div>
  );
}

export default App;
