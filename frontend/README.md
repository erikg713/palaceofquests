# Palace of Quests 🏰

An immersive metaverse RPG built for the Pi Network. Explore realms, take
quests, trade loot in the marketplace, and talk to NPCs — with Pi sign-in
and Pi payments in Pi Browser.

## Screens

- **Home** (`/`) — hero, Pi sign-in, HUD, realm + quest previews
- **Realms** (`/world`) — Moon Fortress and Plasma Citadel, unlockable with Pi
- **Quests** (`/quests`, `/quests/:id`) — 6 seed quests; accept, complete,
  earn XP / Pi / loot (progress saved on-device)
- **Marketplace** (`/marketplace`) — the 8-item catalog, priced in Pi
- **Inventory** (`/inventory`) — starter pack + quest loot
- **NPCs** (`/npcs`) — dialog trees, incl. a Pi-payment quest branch

## Run it

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (vite build)
npm run preview  # serve the production build locally
npm test         # vitest
npm run type-check
```

## How it works

- **Vite + React 18 + Tailwind 3.** Entry is `index.html` (root) →
  `src/main.jsx` → `src/App.jsx` (navbar + router).
- **Pi SDK 2.0 via `window.Pi`** — loaded from the `<script>` tag in
  `index.html`. There is no npm Pi SDK. See `src/piClient.js`. Sign-in only
  works inside Pi Browser or the Pi Sandbox; outside them the app says so
  honestly. In `npm run dev` with no Pi SDK present, a mock Pioneer is
  installed (`src/utils/mockpi.js`) so the game is explorable.
- **Local data first.** Quests, realms, items, and NPCs live in `src/data/`.
  Quest progress, realm unlocks, and loot persist in localStorage until the
  backend is connected.
- **Supabase is optional.** When `VITE_SUPABASE_URL` /
  `VITE_SUPABASE_ANON_KEY` are set, `src/lib/supabaseClient.js` creates the
  client; otherwise it is `null` and the game runs on local data.
- **Pi payments need a backend.** `window.Pi.createPayment` opens the
  payment in Pi Browser, but server approval/completion (`/payment/approve`,
  `/payment/complete`) needs `VITE_API_BASE_URL` pointing at a backend that
  calls the Pi Platform API with the app's Pi API key. Until then the app
  says so instead of pretending a payment completed.
- **QuestDAO is NOT wired.** A Solidity DAO cannot run on Pi Network
  (Stellar-based, no EVM). Governance stays unwired until a home is picked
  for it.

## Environment variables (all optional)

| Variable | What it does |
|---|---|
| `VITE_API_BASE_URL` | Backend for Pi payment approve/complete (default `http://localhost:5000`) |
| `VITE_PI_APP_ID` | Pi app id, for server-side verification |
| `VITE_PI_SANDBOX` | `true` (default, testnet) or `false` (mainnet) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

## License

See the repo root `License.md`.
