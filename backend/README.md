# backend/README.md

## Palace of Quests Backend

This backend powers the full-stack Web3 game *Palace of Quests*, enabling turn-based boss battles, realm navigation, inventory management, and item trading through a REST API.

### 📦 Tech Stack

* **Node.js + Express** — API & game logic
* **PostgreSQL** — Persistent storage for players, realms, bosses, loot
* **JWT** — Auth tokens for Pi Wallet users
* **Pi Network SDK** — Login & user validation
* **Supabase / AWS S3** — Asset storage (images, audio, etc.)

---

## 🔧 Project Structure

```bash
backend/
├── controllers/        # Route logic
├── models/             # DB schema + ORM setup
├── routes/             # API routes
├── services/           # Battle engine, realm logic
├── middleware/         # Auth, error handling
├── config/             # DB, env
├── utils/              # RNG, loot drops, etc
├── app.js              # Main Express app
├── server.js           # Entry point
└── prisma/             # DB migrations/schema (if Prisma is used)
```

---

## 🧱 API Overview

### Auth

* `POST /auth/login` → Exchange Pi wallet payload for JWT

### Player

* `GET /player` → Get player state
* `POST /player/start` → Initialize new player account

### Realms

* `GET /realms` → List all active realms
* `GET /realms/:id` → Load realm detail and boss config

### Battle

* `POST /battle/start` → Start turn-based combat
* `POST /battle/turn` → Submit player move

### Inventory

* `GET /inventory` → Player's loot

### Marketplace

* `GET /marketplace` → View items for sale
* `POST /marketplace/list` → List item for trade

### Admin

* `POST /admin/realms` → Add or update a realm
* `POST /admin/bosses` → Add or update a boss
* `POST /admin/items` → Add or update loot

---

## ⚔️ Battle Engine Logic

Turn-based combat is handled by a battle service:

1. Retrieve player and boss stats
2. Simulate turn (calculate hit, crit, dodge, skill)
3. Apply effects (damage, healing, buffs)
4. Store combat log
5. Resolve outcome (win/loss)
6. Award loot and XP

All logic is server-side to prevent client tampering.

---

## 🧪 Testing & Local Dev

```bash
# .env
DATABASE_URL=postgresql://...
JWT_SECRET=...
PI_API_KEY=...
```

```bash
npm install
npm run dev
```

Use tools like Postman to test API routes. Seed scripts can populate test realms and bosses.

---

## 📤 Deployment

* Frontend: Vercel
* Backend: Render / Railway
* Database: Supabase / Neon

---

## ✅ MVP Completion Criteria

* Pi Wallet login works
* Players can enter realms
* Backend computes combat outcomes
* Inventory and marketplace function
* Admin can create/update content

---
