import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import SecondaryCharts from "./SecondaryCharts";
import AssumptionsFooter from "./AssumptionsFooter";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-6 pb-16 md:px-6 md:py-8"
      >
        <HeroSection />

        <SecondaryCharts />
      </main>
      <AssumptionsFooter />
    </div>
  );
}

export default App;
