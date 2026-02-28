import { HeroSection } from "./home/HeroSection";
import { InsightCards } from "./home/InsightCards";
import { ToolLinks } from "./home/ToolLinks";
import { PageLayout } from "./layout/PageLayout";
import { AssumptionsCallout } from "./shared/AssumptionsCallout";
import { PlanFromQuery } from "./shared/PlanFromQuery";
import { PersonalizedResultsProvider } from "@/context/PersonalizedResultsContext";

function App() {
  return (
    <>
      <PlanFromQuery />
      <PersonalizedResultsProvider>
        <PageLayout>
          <HeroSection />

          <InsightCards />

          <AssumptionsCallout />

          <ToolLinks />
        </PageLayout>
      </PersonalizedResultsProvider>
    </>
  );
}

export default App;
