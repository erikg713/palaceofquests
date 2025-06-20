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
│   ├── main.py
│   └── ... (routers, models, services)
├── requirements.txt
├── .env
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
