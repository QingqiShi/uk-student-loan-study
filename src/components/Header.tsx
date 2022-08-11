import { AppBar, Toolbar, Typography, useScrollTrigger } from '@mui/material';

interface HeaderProps {}

export function Header(_props: HeaderProps) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  return (
    <>
      <AppBar elevation={trigger ? 4 : 0}>
        <Toolbar>
          <Typography variant="h6" component="h1" fontWeight="bold">
            UK Student Loan Study
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
