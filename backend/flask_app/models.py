from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Text, ForeignKey, 
    UniqueConstraint, Index, func, JSON
)
from sqlalchemy.orm import relationship, declarative_base, validates

Base = declarative_base()

class Player(Base):
    __tablename__ = "players"
    __table_args__ = (Index("ix_player_username", "username"),)

    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    pi_uid = Column(String(128), unique=True, nullable=False)  # Pi Network user ID
    pi_wallet = Column(String(120), unique=True, nullable=True)  # Pi wallet address
    pi_auth_token = Column(String(256), nullable=True)  # Last Pi auth token, for reference/logging
    pi_auth_verified_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_login = Column(DateTime(timezone=True), nullable=True)
    level = Column(Integer, default=1, nullable=False)
    experience = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    quests = relationship("PlayerQuest", back_populates="player", cascade="all, delete-orphan", lazy="selectin")
    reward_transactions = relationship("PiRewardTransaction", back_populates="player", cascade="all, delete-orphan", lazy="selectin")
    auth_logs = relationship("PiAuthLog", back_populates="player", cascade="all, delete-orphan", lazy="selectin")

    def __repr__(self):
        return f"<Player id={self.id} username={self.username!r} pi_uid={self.pi_uid!r} active={self.is_active}>"

class Quest(Base):
    __tablename__ = "quests"
    __table_args__ = (Index("ix_quest_active", "is_active"),)

    id = Column(Integer, primary_key=True)
    title = Column(String(150), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    reward = Column(String(120), nullable=True)  # Could be Pi tokens, items, etc.
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    players = relationship("PlayerQuest", back_populates="quest", cascade="all, delete-orphan", lazy="selectin")

    def __repr__(self):
        return f"<Quest id={self.id} title={self.title!r} active={self.is_active}>"

class PlayerQuest(Base):
    __tablename__ = "player_quests"
    __table_args__ = (
        UniqueConstraint("player_id", "quest_id", name="_player_quest_uc"),
        Index("ix_player_quest_completed", "is_completed"),
    )

    id = Column(Integer, primary_key=True)
    player_id = Column(Integer, ForeignKey("players.id", ondelete="CASCADE"), nullable=False)
    quest_id = Column(Integer, ForeignKey("quests.id", ondelete="CASCADE"), nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    is_completed = Column(Boolean, default=False, nullable=False)
    pi_reward_tx = Column(String(120), nullable=True)  # Pi Network transaction ID
    pi_reward_amount = Column(Integer, nullable=True)  # Amount paid out (in Pi, or smallest unit)

    player = relationship("Player", back_populates="quests", lazy="joined")
    quest = relationship("Quest", back_populates="players", lazy="joined")

    def __repr__(self):
        return f"<PlayerQuest player_id={self.player_id} quest_id={self.quest_id} completed={self.is_completed}>"

class PiRewardTransaction(Base):
    __tablename__ = "pi_reward_transactions"
    __table_args__ = (Index("ix_pi_tx_player", "player_id"),)

    id = Column(Integer, primary_key=True)
    player_id = Column(Integer, ForeignKey("players.id", ondelete="CASCADE"), nullable=False)
    quest_id = Column(Integer, ForeignKey("quests.id", ondelete="SET NULL"), nullable=True)
    tx_id = Column(String(256), unique=True, nullable=False)
    amount = Column(Integer, nullable=False)
    status = Column(String(64), default="pending")  # pending, success, failed
    raw_response = Column(JSON, nullable=True)  # Store Pi Network API response if needed
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    confirmed_at = Column(DateTime(timezone=True), nullable=True)

    player = relationship("Player", back_populates="reward_transactions", lazy="joined")
    quest = relationship("Quest", lazy="selectin")

    def __repr__(self):
        return f"<PiRewardTransaction tx_id={self.tx_id} player_id={self.player_id} status={self.status}>"

class PiAuthLog(Base):
    __tablename__ = "pi_auth_logs"
    __table_args__ = (Index("ix_pi_auth_player", "player_id"),)

    id = Column(Integer, primary_key=True)
    player_id = Column(Integer, ForeignKey("players.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(32), nullable=False)  # login, logout, refresh, etc.
    pi_uid = Column(String(128), nullable=False)
    auth_token = Column(String(256), nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    player = relationship("Player", back_populates="auth_logs", lazy="joined")

    def __repr__(self):
        return f"<PiAuthLog player_id={self.player_id} event_type={self.event_type} at={self.created_at}>"
