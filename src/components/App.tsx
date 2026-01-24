import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Header } from './Header';
import { Layout } from './Layout';
import { ConfigPanel } from './ConfigPanel';
import { ChartsGrid } from './ChartsGrid';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

function App() {
  // PWA removed - will add back in Phase 8
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Header />
      <Layout stickyPanel={<ConfigPanel />} content={<ChartsGrid />} />
    </ThemeProvider>
  );
}

export default App;
