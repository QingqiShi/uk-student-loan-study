import { createTheme, CssBaseline, styled, ThemeProvider } from '@mui/material';
import { Header } from './Header';
import { Layout } from './Layout';
import { ConfigPanel } from './ConfigPanel';
import { ChartsGrid } from './ChartsGrid';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Header />
      <Layout stickyPanel={<ConfigPanel />} content={<ChartsGrid />} />
    </ThemeProvider>
  );
}

export default App;
