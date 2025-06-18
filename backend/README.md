### Python Backend Setup ###
```bash
Copy
Edit
python -m venv env
source env/bin/activate
pip install fastapi uvicorn python-dotenv requests httpx
---
### INSTALL DEPENDENCIES ###
requirements.txt
fastapi
uvicorn
requests
httpx
python-dotenv

---

### RUN THE SERVER ###
uvicorn app.main:app --reload --port 4000
---
