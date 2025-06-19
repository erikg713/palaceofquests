from sqlalchemy import (
    Column, Integer, String, Boolean, Text, DateTime, ForeignKey, UniqueConstraint, func
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Quest(Base):
    __tablename__ = "quests"

    id = Column(Integer, primary_key=True)
    title = Column(String(150), nullable=False, index=True)
    description = Column(Text, nullable=False)
    reward = Column(String(120))
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    players = relationship("PlayerQuest", back_populates="quest", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Quest(title='{self.title}', active={self.is_active})>"

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True)
    username = Column(String(64), unique=True, nullable=False, index=True)
    level = Column(Integer, default=1, nullable=False)
    experience = Column(Integer, default=0, nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    quests = relationship("PlayerQuest", back_populates="player", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Player(username='{self.username}', level={self.level})>"

class PlayerQuest(Base):
    __tablename__ = "player_quests"
    __table_args__ = (
        UniqueConstraint('player_id', 'quest_id', name='_player_quest_uc'),
    )

    id = Column(Integer, primary_key=True)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    quest_id = Column(Integer, ForeignKey("quests.id"), nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True))
    is_completed = Column(Boolean, default=False, nullable=False)

    player = relationship("Player", back_populates="quests")
    quest = relationship("Quest", back_populates="players")

    def __repr__(self):
        status = "Completed" if self.is_completed else "In Progress"
        return f"<PlayerQuest(player_id={self.player_id}, quest_id={self.quest_id}, {status})>"
