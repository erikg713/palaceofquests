---
# Palace of Quests Python Backend

High-performance, asynchronous Python backend powering the Palace of Quests API — designed with FastAPI for modern, scalable, and secure Web3/metaverse applications.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Dependencies](#dependencies)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Best Practices](#best-practices)
- [Contributing](#contributing)

---

## Overview

This backend serves as the foundation for a decentralized questing platform in the metaverse, supporting:
- Secure Pi Wallet authentication and payment flows
- Real-time quest management
- Integration-ready architecture for on-chain/off-chain interoperability

---
---

## Running with Docker

You can run the entire Palace of Quests stack using Docker Compose for a consistent, reproducible development or deployment environment.

### Requirements
- **Docker** and **Docker Compose** installed
- No need to install Node.js or Python locally—everything runs in containers

### Service Overview
| Service               | Port(s) Exposed | Key Version(s)         | Notes                                  |
|----------------------|-----------------|------------------------|----------------------------------------|
| Backend (Python)     | 4000, 5000      | Python 3.9             | FastAPI (4000) or Flask fallback (5000) |
| Frontend (JavaScript)| 4173            | Node.js 22.13.1        | Vite preview server                    |
| Database (Postgres)  | 5432            | postgres:latest        | Data persisted in Docker volume        |

### Environment Variables
- **Backend:**
  - Reads from `./backend/.env` (see sample in repo for required keys)
- **Frontend:**
  - Reads from `./frontend/.env` (see sample in repo for required keys)
- **Database:**
  - `POSTGRES_USER=postgres`
  - `POSTGRES_PASSWORD=postgres`
  - `POSTGRES_DB=palace_of_quests`

### Build & Run

From the project root directory:

\```bash
docker compose up --build
\```

- The backend will be available at [http://localhost:4000](http://localhost:4000) (FastAPI) or [http://localhost:5000](http://localhost:5000) (Flask fallback)
- The frontend will be available at [http://localhost:4173](http://localhost:4173)
- The Postgres database will be accessible at `localhost:5432`

### Special Notes
- **Backend**: The container auto-detects whether to run FastAPI (`flask_app/main.py`) or Flask (`app.py`).
- **Frontend**: Uses Vite's preview server for production-like builds.
- **Database**: Data is persisted in a Docker volume (`pgdata`).
- **Networking**: All services are on the `appnet` Docker network for internal communication.
- **Healthchecks**: Postgres includes a healthcheck for readiness.

---



## Prerequisites

- **Python 3.9+**
- **PostgreSQL** (for Supabase integration)
- **Supabase account** and API keys
- **Node.js** (for full-stack development and integration)
- Linux/macOS/WSL recommended for local development

---

## Dependencies

All dependencies are managed in `requirements.txt`. Key packages include:
- `fastapi`: Modern, async Python web framework
- `uvicorn`: Lightning-fast ASGI server
- `requests` / `httpx`: Synchronous & async HTTP clients
- `python-dotenv`: Secure .env config loading

Install with:

```bash
python -m venv env
source env/bin/activate
pip install -r requirements.txt
```

---

## Environment Variables

Configure secrets and keys in `.env` (never commit this file):

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=your_supabase_key
PI_API_KEY=your_pi_api_key
ENV=development
```

---

## Running the Server

Start the development server:

```bash
uvicorn app.main:app --reload --port 4000
```

- Visit [http://localhost:4000/docs](http://localhost:4000/docs) for Swagger UI.
- Use `--reload` for hot-reloading in development.

---

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py
│   │   └── routes/
│   │       ├── auth.py        # Pi Wallet authentication (Web3 ready)
│   │       ├── quests.py      # Quest CRUD, metaverse logic
│   │       ├── payments.py    # Decentralized payments (A2U/Pi)
│   │       └── users.py       # User profile management
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py        # JWT & token verification
│   │   └── supabase.py        # Supabase client
│   ├── models/
│   │   ├── quest.py
│   │   ├── user.py
│   │   └── payment.py
│   ├── services/
│   │   ├── quest_service.py
│   │   ├── payment_service.py
│   │   └── user_service.py
│   ├── db/
│   │   └── supabase_client.py
│   └── main.py                # App entrypoint
├── tests/
│   ├── test_quests.py
│   ├── test_auth.py
│   └── ...
├── .env
├── requirements.txt
└── README.md
```

---

## API Documentation

- Interactive docs: [http://localhost:4000/docs](http://localhost:4000/docs)
- OpenAPI schema auto-generated by FastAPI

---

## Best Practices

- **Security:** All sensitive data handled via environment variables.
- **Type Safety:** Full type annotations and Pydantic models.
- **Async-First:** All endpoints are non-blocking/asynchronous.
- **Web3 Integration:** Ready for wallet auth, decentralized payments, and future smart contract hooks.
- **Testing:** Write unit/integration tests in `tests/`, run with `pytest`.
- **Style:** Follow PEP8. Document all modules and endpoint logic.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Follow PEP8, use type annotations, and add docstrings.
3. Write and update tests as needed.
4. Submit a pull request with a clear description.

---

## Future Roadmap

- Decentralized identity (DID) support
- NFT quest rewards and asset tracking
- Real-time notifications via WebSockets
- On-chain quest/event logging

---

**Ready to power the next generation of metaverse quests.**

---
