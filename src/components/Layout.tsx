import { Box, Paper, styled } from '@mui/material';

const Container = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '400px 1fr',
  },
}));

interface LayoutProps {
  stickyPanel?: React.ReactNode;
  content?: React.ReactNode;
}

export function Layout({ stickyPanel, content }: LayoutProps) {
  return (
    <Container>
      <Box position="relative" height="100%">
        <Box
          position="sticky"
          top={64}
          maxHeight="calc(100vh - 64px)"
          py={2}
          overflow="auto"
        >
          {stickyPanel}
        </Box>
      </Box>
      <Box py={2}>
        <Paper>{content}</Paper>
      </Box>
    </Container>
  );
}
