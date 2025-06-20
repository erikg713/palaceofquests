---

# Python Backend Setup

This backend powers the Palace of Quests API using FastAPI for high-performance, asynchronous endpoints.

---

## Dependencies

All dependencies are listed in `requirements.txt`:

```
fastapi
uvicorn
requests
httpx
python-dotenv
```

Install them with:

```bash
python -m venv env
source env/bin/activate
pip install -r requirements.txt
```

---

## Running the Server

```bash
uvicorn app.main:app --reload --port 4000
```

- `--reload` enables auto-restart on code changes during development.
- Default port is `4000` (customize as needed).

---

## Environment

- Place sensitive configuration in a `.env` file.
- Backend auto-loads environment variables via `python-dotenv`.

---

## Project Structure

```
backend/
├── app/
│   ├── api/                     # All route definitions
│   │   ├── deps.py              # Dependencies (auth, DB session)
│   │   ├── routes/
│   │   │   ├── auth.py          # Pi Wallet auth verification
│   │   │   ├── quests.py        # Quest CRUD routes
│   │   │   ├── payments.py      # A2U Pi payment handling
│   │   │   └── users.py         # User profile/lookup
│   │   └── __init__.py
│   │
│   ├── core/                    # Core logic & configuration
│   │   ├── config.py            # App settings from .env
│   │   ├── security.py          # Token verification (e.g., Pi token)
│   │   └── supabase.py          # Supabase client wrapper
│   │
│   ├── models/                  # Pydantic + DB models
│   │   ├── quest.py
│   │   ├── user.py
│   │   └── payment.py
│   │
│   ├── services/                # Business logic (use cases)
│   │   ├── quest_service.py
│   │   ├── payment_service.py
│   │   └── user_service.py
│   │
│   ├── db/                      # Optional DB setup or ORM logic
│   │   └── supabase_client.py   # Supabase integration logic
│   │
│   └── main.py                  # Entry point (FastAPI app)
│
├── tests/                       # Unit and integration tests
│   ├── test_quests.py
│   ├── test_auth.py
│   └── ...
│
├── .env                         # Secrets and config (PI keys, Supabase keys)
├── requirements.txt             # All backend deps
└── README.md
```

---

## API Documentation

Once running, visit: [http://localhost:4000/docs](http://localhost:4000/docs) for interactive Swagger UI.

---

## Notes

- Use `requests` and `httpx` for robust HTTP integrations.
- The backend is stateless and scalable; deploy behind a WSGI/ASGI server for production.

---

## Contributing

- Follow PEP8 style and type annotations where possible.
- Document all endpoints and business logic.
- Tests are welcome (pytest preferred).

---
