# UK Student Loan Study

An interactive calculator to help understand UK student loan repayment under Plan 2/Plan 5 and Postgraduate loan schemes.

## Features

- Calculate total repayment amounts based on salary
- Visualize repayment timelines and effective interest rates
- Compare Plan 2 (pre-2023) vs Plan 5 (post-2023) schemes
- Account for postgraduate loans running concurrently
- See personalized projections based on your salary

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + ShadCN components
- **Charts**: Visx
- **State Management**: Zustand with Immer
- **Testing**: Vitest + React Testing Library

## Development

### Prerequisites

- Node.js 18+
- Yarn

### Setup

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `yarn test` | Run tests in watch mode |
| `yarn test:coverage` | Run tests with coverage |

## Project Structure

```
src/
  app/                 # Next.js App Router
    layout.tsx         # Root layout with metadata
    page.tsx           # Main calculator page
  components/          # React components
    ui/                # ShadCN UI components
  hooks/               # Custom React hooks
  utils/               # Utility functions
  types/               # TypeScript types
  lib/                 # Shared utilities
  store.ts             # Zustand store
  constants.ts         # Application constants
```

## Deployment

The app is deployed on Vercel. Push to `main` to trigger a deployment.

## UK Student Loan Plans

### Plan 2 (Pre-2023 Students)
- Repayment threshold: 2,274/month
- Repayment rate: 9% above threshold
- Interest: RPI to RPI+3% based on income
- Write-off: 30 years after first repayment

### Plan 5 (Post-2023 Students)
- Repayment threshold: 2,083/month
- Repayment rate: 9% above threshold
- Interest: RPI only (no income-based uplift)
- Write-off: 40 years after first repayment

### Postgraduate Loans
- Repayment threshold: 1,750/month
- Repayment rate: 6% above threshold
- Runs concurrently with undergraduate loan

## License

MIT
