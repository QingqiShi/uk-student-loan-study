import { Header } from "./Header";
import { Layout } from "./Layout";
import { ConfigPanel } from "./ConfigPanel";
import { ChartsGrid } from "./ChartsGrid";

function App() {
  return (
    <>
      <Header />
      <Layout stickyPanel={<ConfigPanel />} content={<ChartsGrid />} />
    </>
  );
}

export default App;
