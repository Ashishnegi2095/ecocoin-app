# EcoCoin AI Builder Prompt

Build EcoCoin as a complete cross-platform Android/iOS recycling rewards app using React Native, Expo Router, TypeScript and Supabase.

Implement these screens: authentication, home dashboard, QR machine scanner, clearly labelled demo deposit simulator, wallet, transaction history, reward catalogue, profile and admin console. Use a clean professional green/white environmental design.

Use Supabase Auth and PostgreSQL. Create profiles, machines, reward_rates, wallets, deposits, coin_transactions, rewards, redemptions and notifications tables. Apply Row Level Security. Never allow the client to directly write wallet balances.

Prototype reward rates: PET = 10 EcoCoins/kg; plastic film = 5 EcoCoins/kg. The server must calculate and credit coins through a database function. A deposit must be tied to an authenticated user, available demo machine and unique transaction. Include duplicate/replay protection.

The first release must use a software deposit simulator only. Clearly label simulated weights and counts as user-entered demo data, not real sensor readings. QR scanning identifies a machine but does not prove that plastic was deposited.

Prepare a hardware integration boundary for a future ESP32 machine using authenticated HTTPS API requests, machine credentials, idempotency keys and server-side validation. Do not pretend hardware is connected.

Use the included `supabase/schema.sql` as the database starting point. Produce working navigation, forms, loading/error states, responsive Android/iOS layouts, and setup instructions. Never expose Supabase service-role credentials in the mobile app.
