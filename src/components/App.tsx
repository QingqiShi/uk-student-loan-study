import { HeroSection } from "./home/HeroSection";
import { SecondaryCharts } from "./home/SecondaryCharts";
import { ToolLinks } from "./home/ToolLinks";
import { PageLayout } from "./layout/PageLayout";
import { AssumptionsCallout } from "./shared/AssumptionsCallout";
import { PlanFromQuery } from "./shared/PlanFromQuery";

function App() {
  return (
    <>
      <PlanFromQuery />
      <PageLayout>
        <HeroSection />

        <SecondaryCharts />

        <AssumptionsCallout />

        <ToolLinks />
      </PageLayout>
    </>
  );
}

export default App;
