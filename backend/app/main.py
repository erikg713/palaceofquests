from fastapi import FastAPI
from app.routes import players, quests, dao

app = FastAPI(title="Palace of Quests API")

app.include_router(players.router, prefix="/api/players", tags=["Players"])
app.include_router(quests.router, prefix="/api/quests", tags=["Quests"])
app.include_router(dao.router, prefix="/api/dao", tags=["DAO Voting"])

@app.get("/")
def index():
    return {"message": "Welcome to Palace of Quests API"}

