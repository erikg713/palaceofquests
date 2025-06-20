```
 Palace of Quests

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Pi%20Network-blueviolet)
![Status](https://img.shields.io/badge/status-alpha-orange)

A decentralized metaverse marketplace game where users complete quests, trade digital assets, and earn rewards—all powered by Web3 technology on the Pi Network.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
  - [Database Setup](#database-setup)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

**Palace of Quests** is a next-generation digital economy platform fusing gaming and decentralized finance. By leveraging Pi Network's blockchain, we bring secure, trustless, and rewarding experiences to players and creators. Users can undertake quests, earn digital assets, and participate in a player-driven marketplace.

---

## Features

- **Decentralized Marketplace:** Buy, sell, and trade digital items with confidence, powered by blockchain.
- **Quest System:** Complete quests to earn rewards and unlock new levels.
- **Secure Payments:** All transactions use Pi Network’s Payment Identifier for robust security and instant settlement.
- **Cross-Chain Ready:** Ethereum and Polygon integrations planned for broader asset accessibility.
- **Progressive Web App:** Seamless experience on web or mobile, including offline support.
- **Premium Content:** In-app purchases and premium quests to enhance engagement and value.

---

## Technology Stack

| Layer      | Tech                    | Purpose                                  |
|------------|-------------------------|------------------------------------------|
| Frontend   | React, Vite, FontAwesome| Responsive, dynamic UI                   |
| Backend    | FastAPI (Python)        | Scalable API and business logic          |
| Database   | PostgreSQL              | Reliable, relational data storage        |
| Blockchain | Pi Network (Ethereum, Polygon planned) | Decentralized, trustless transactions |
| Dev Tools  | dotenv, Axios, React Router | Config mgmt, HTTP, navigation       |

---

## Getting Started

### Frontend Setup

```bash
cd palace-of-quests-frontend
npm install
npm install react-router-dom axios @fortawesome/react-fontawesome dotenv
npm run dev
```

**Project structure:**
```
palace-of-quests-frontend/
├── public/
│   ├── index.html
│   └── pi-app.json
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── QuestCard.jsx
│   │   ├── MarketplaceItem.jsx
│   │   └── PiWalletLogin.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Quests.jsx
│   │   └── Marketplace.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── piClient.js        # Pi SDK integration
│   └── config.js          # Environment/config constants
├── .env
├── index.css
├── vite.config.js
└── package.json
```

### Backend Setup

```bash
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 4000
```

**Key dependencies:** FastAPI, Uvicorn, Python-dotenv, Requests, HTTPX

### Database Setup

```bash
cd database
psql -f schema.sql
# (Optional) Apply migrations for production
psql -f migrations/001_init.sql
# Seed with sample data for development
psql -f seed.sql
# Enable custom triggers and views
psql -f functions.sql
```

- All timestamps use UTC.
- Primary keys use UUIDs.
- Foreign keys are `NOT NULL` unless optional.
- Indexes optimize frequent lookups.

---

## Usage

1. **Register/Login:** Sign up using your Pi Network wallet.
2. **Complete Quests:** Engage in quests to earn in-app rewards and level up.
3. **Marketplace:** Trade digital assets with other players.
4. **Payments:** All transactions leverage Pi’s secure Payment Identifier.
5. **Premium Content:** Purchase premium items or quest passes for exclusive experiences.

_Note: Ethereum and Polygon support will be added in future updates._

---

## Roadmap

- **Phase 1:** Launch on Pi Network (Quests + Marketplace) — _In Progress_
- **Phase 2:** Premium quests and in-app purchases — _Planned_
- **Phase 3:** Multichain currency and asset support (Ethereum, Polygon) — _Planned_

---

## Contributing

We welcome contributions! Please:

- Fork the repository and create your branch.
- Write clear, concise, and well-documented code.
- Follow existing code style and best practices.
- Submit a pull request with a detailed description.

For major changes, open an issue first to discuss.

---

## License

This project is licensed under the PI Network License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions, feedback, or partnership requests:

- GitHub Issues/Discussions
- Email: dev713@protonmail.com

---
