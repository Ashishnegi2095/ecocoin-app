# EcoCoin — Smart recycling & travel rewards

EcoCoin is a responsive, frontend-only demonstration of a recycling-to-travel-rewards experience. The original ZIP was an Expo/Supabase mobile starter; its product concepts and forest-green theme informed this Vite web implementation. No real machine, reservation service, payment provider, or backend is connected.

## What’s in the demo

- Landing page, member dashboard, digital EcoCard, wallet, travel rewards and searchable transaction history.
- Simulated recycling for plastic, MLP, HDPE and other non-biodegradable waste, including decimal weights, distinct reward rates, processing feedback and a transaction receipt.
- Partial EcoCoin redemption toward example trips, balance and payable safeguards, and a clearly marked demo booking receipt.
- Browser LocalStorage persistence and editable demo profile, reward rates and machine status.
- Resettable, populated first-run data. All screens use the same persisted state.

## Requirements and local development

- Node.js 20.19+ (or 22.12+) and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Useful checks:

```bash
npm run typecheck
npm run build
npm run preview
```

## Demo rates and reward math

Update the defaults in `src/config/rewards.ts`. Plastic is configured at **100 EC/kg**; the separate MLP, HDPE and other-material values are examples and are explicitly marked **DEMO RATE** in the UI. EcoCoins are calculated as weight (kg) × category rate. The demo exchange value is **100 EC = ₹50**.

The settings page stores rate edits in LocalStorage. It also lets you change the demo member name, pause simulated deposits, and reset the original sample data with a selected starting balance.

## Routes

- `/` — public landing page
- `/dashboard` — impact, balance, activity and trip recommendations
- `/recycle` — smart recycling simulation
- `/wallet` — balances and transactions
- `/ecocard` — digital EcoCard
- `/travel` — trip selection and EcoCoin redemption
- `/history` — searchable, filterable activity with CSV export
- `/settings` — local demo configuration and reset

## Vercel deployment

Import the project directory (`ecocoin-app`) into Vercel. The Vite build outputs to `dist` by default; `vercel.json` rewrites SPA routes to `index.html`. No environment variables or backend services are required.

For manual deployment:

```bash
npm install
npm run build
```

Deploy the generated `dist` directory as a static site.

## Demonstration and safety notes

- LocalStorage is browser-local and is not a secure ledger or shared database. Clearing site data removes saved demo changes.
- Machine status, material, weight and rewards are simulated in the browser; the app does not connect to physical hardware or verify real deposits.
- Destination prices, bookings and EcoCoin discounts are illustrative only. No booking or payment is made.
- The starter ZIP’s legacy Supabase schema and native Expo screens are retained as source reference only; this web build does not use them.
