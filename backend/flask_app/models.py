# Standard library imports
import enum
import re
from datetime import datetime

# Third-party imports
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Text, ForeignKey,
    UniqueConstraint, Index, CheckConstraint, func, JSON
)
from sqlalchemy.orm import relationship, declarative_base, validates

# Database instances
db = SQLAlchemy()
Base = declarative_base()


class TimestampMixin:
    """Mixin for adding created_at and updated_at timestamp fields."""
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(),
                        onupdate=func.now(), nullable=False)


class ItemCategory(enum.Enum):
    """Enumeration for item categories in the game."""
    vehicle = "vehicle"
    weapon = "weapon"
    magic = "magic"
    furniture = "furniture"


class User(db.Model):
    """
    User model for Flask-SQLAlchemy integration.
    Represents basic user entities in the game.
    """
    __tablename__ = "users"
    __table_args__ = (
        Index("ix_user_username", "username"),
        CheckConstraint("LENGTH(username) >= 3", name="ck_user_username_length"),
    )

    id = db.Column(db.String(36), primary_key=True)
    username = db.Column(db.String(32), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    inventories = db.relationship("Inventory", back_populates="user", lazy="selectin")

    @validates('username')
    def validate_username(self, key, username):
        """Validate username format and length."""
        if not username or len(username) < 3:
            raise ValueError("Username must be at least 3 characters long")
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            raise ValueError("Username can only contain letters, numbers, and underscores")
        return username

    def __repr__(self):
        return f"<User id={self.id} username={self.username!r}>"


class Item(db.Model):
    """
    Item model representing game items with categories and stats.
    """
    __tablename__ = "items"
    __table_args__ = (
        Index("ix_item_category", "category"),
        Index("ix_item_rarity", "rarity"),
        CheckConstraint("sell_price >= 0", name="ck_item_price_positive"),
    )

    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    category = db.Column(db.Enum(ItemCategory), nullable=False)
    rarity = db.Column(db.String(20))
    sell_price = db.Column(db.Integer, default=0)
    icon_url = db.Column(db.String(255))
    stats = db.Column(db.JSON)

    # Relationships
    inventories = db.relationship("Inventory", back_populates="item", lazy="selectin")

    @validates('stats')
    def validate_stats(self, key, stats):
        """Validate stats JSON structure."""
        if stats is not None and not isinstance(stats, dict):
            raise ValueError("Stats must be a valid JSON object")
        return stats

    def __repr__(self):
        return f"<Item id={self.id} name={self.name!r} category={self.category.value}>"


class Inventory(db.Model):
    """
    Inventory model representing user-item relationships with quantities.
    """
    __tablename__ = "inventories"
    __table_args__ = (
        CheckConstraint("qty >= 0", name="ck_inventory_qty_positive"),
    )

    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), primary_key=True)
    item_id = db.Column(db.String(36), db.ForeignKey("items.id"), primary_key=True)
    qty = db.Column(db.Integer, default=1, nullable=False)

    # Relationships
    user = db.relationship("User", back_populates="inventories", lazy="selectin")
    item = db.relationship("Item", back_populates="inventories", lazy="selectin")

    @validates('qty')
    def validate_quantity(self, key, qty):
        """Validate quantity is non-negative."""
        if qty < 0:
            raise ValueError("Quantity must be non-negative")
        return qty

    def __repr__(self):
        return f"<Inventory user_id={self.user_id} item_id={self.item_id} qty={self.qty}>"


class Player(Base, TimestampMixin):
    """
    Player model for SQLAlchemy ORM.
    Represents players with Pi Network integration and game progression.
    """
    __tablename__ = "players"
    __table_args__ = (
        Index("ix_player_username", "username"),
        Index("ix_player_pi_uid", "pi_uid"),
        Index("ix_player_active", "is_active"),
        UniqueConstraint("username", name="uq_player_username"),
        UniqueConstraint("pi_uid", name="uq_player_pi_uid"),
        UniqueConstraint("pi_wallet", name="uq_player_pi_wallet"),
        CheckConstraint("level >= 1", name="ck_player_level_positive"),
        CheckConstraint("experience >= 0", name="ck_player_experience_nonnegative"),
        CheckConstraint("LENGTH(username) >= 3", name="ck_player_username_length"),
    )

    id = Column(Integer, primary_key=True)
    username = Column(String(32), unique=True, nullable=False)
    pi_uid = Column(String(128), unique=True, nullable=False)
    pi_wallet = Column(String(64), unique=True, nullable=True)
    pi_auth_token = Column(String(512), nullable=True)
    pi_auth_verified_at = Column(DateTime(timezone=True), nullable=True)
    last_login = Column(DateTime(timezone=True), nullable=True)
    level = Column(Integer, default=1, nullable=False)
    experience = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    quests = relationship("PlayerQuest", back_populates="player",
                          cascade="all, delete-orphan", lazy="selectin")
    reward_transactions = relationship("PiRewardTransaction", back_populates="player",
                                       cascade="all, delete-orphan", lazy="selectin")
    auth_logs = relationship("PiAuthLog", back_populates="player",
                             cascade="all, delete-orphan", lazy="selectin")

    @validates('username')
    def validate_username(self, key, username):
        """Validate username format and length."""
        if not username or len(username) < 3:
            raise ValueError("Username must be at least 3 characters long")
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            raise ValueError("Username can only contain letters, numbers, and underscores")
        return username

    @validates('pi_uid')
    def validate_pi_uid(self, key, pi_uid):
        """Validate Pi Network user ID format."""
        if not pi_uid or len(pi_uid) < 8:
            raise ValueError("Pi UID must be at least 8 characters long")
        return pi_uid

    @validates('level')
    def validate_level(self, key, level):
        """Validate player level is positive."""
        if level < 1:
            raise ValueError("Player level must be at least 1")
        return level

    @validates('experience')
    def validate_experience(self, key, experience):
        """Validate experience is non-negative."""
        if experience < 0:
            raise ValueError("Experience must be non-negative")
        return experience

    def __repr__(self):
        return (f"<Player id={self.id} username={self.username!r} "
                f"pi_uid={self.pi_uid!r} active={self.is_active}>")


class Quest(Base, TimestampMixin):
    """
    Quest model representing game quests with rewards and status tracking.
    """
    __tablename__ = "quests"
    __table_args__ = (
        Index("ix_quest_active", "is_active"),
        Index("ix_quest_title", "title"),
        UniqueConstraint("title", name="uq_quest_title"),
        CheckConstraint("LENGTH(title) >= 3", name="ck_quest_title_length"),
    )

    id = Column(Integer, primary_key=True)
    title = Column(String(150), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    reward = Column(String(120), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    players = relationship("PlayerQuest", back_populates="quest",
                           cascade="all, delete-orphan", lazy="selectin")

    @validates('title')
    def validate_title(self, key, title):
        """Validate quest title length and format."""
        if not title or len(title) < 3:
            raise ValueError("Quest title must be at least 3 characters long")
        return title.strip()

    @validates('description')
    def validate_description(self, key, description):
        """Validate quest description is not empty."""
        if not description or not description.strip():
            raise ValueError("Quest description cannot be empty")
        return description.strip()

    def __repr__(self):
        return f"<Quest id={self.id} title={self.title!r} active={self.is_active}>"


class PlayerQuest(Base, TimestampMixin):
    """
    Association model for player-quest relationships with completion tracking.
    """
    __tablename__ = "player_quests"
    __table_args__ = (
        UniqueConstraint("player_id", "quest_id", name="uq_player_quest"),
        Index("ix_player_quest_completed", "is_completed"),
        Index("ix_player_quest_player", "player_id"),
        Index("ix_player_quest_quest", "quest_id"),
        CheckConstraint("pi_reward_amount >= 0", name="ck_player_quest_reward_positive"),
    )

    id = Column(Integer, primary_key=True)
    player_id = Column(Integer, ForeignKey("players.id", ondelete="CASCADE"), nullable=False)
    quest_id = Column(Integer, ForeignKey("quests.id", ondelete="CASCADE"), nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    is_completed = Column(Boolean, default=False, nullable=False)
    pi_reward_tx = Column(String(128), nullable=True)
    pi_reward_amount = Column(Integer, nullable=True)

    # Relationships
    player = relationship("Player", back_populates="quests", lazy="joined")
    quest = relationship("Quest", back_populates="players", lazy="joined")

    @validates('pi_reward_amount')
    def validate_reward_amount(self, key, amount):
        """Validate reward amount is non-negative."""
        if amount is not None and amount < 0:
            raise ValueError("Reward amount must be non-negative")
        return amount

    def __repr__(self):
        return (f"<PlayerQuest player_id={self.player_id} quest_id={self.quest_id} "
                f"completed={self.is_completed}>")


class PiRewardTransaction(Base, TimestampMixin):
    """
    Model for tracking Pi Network reward transactions.
    """
    __tablename__ = "pi_reward_transactions"
    __table_args__ = (
        Index("ix_pi_tx_player", "player_id"),
        Index("ix_pi_tx_status", "status"),
        UniqueConstraint("tx_id", name="uq_pi_tx_id"),
        CheckConstraint("amount > 0", name="ck_pi_tx_amount_positive"),
        CheckConstraint("status IN ('pending', 'success', 'failed')",
                        name="ck_pi_tx_status_valid"),
    )

    id = Column(Integer, primary_key=True)
    player_id = Column(Integer, ForeignKey("players.id", ondelete="CASCADE"), nullable=False)
    quest_id = Column(Integer, ForeignKey("quests.id", ondelete="SET NULL"), nullable=True)
    tx_id = Column(String(256), unique=True, nullable=False)
    amount = Column(Integer, nullable=False)
    status = Column(String(20), default="pending", nullable=False)
    confirmed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    player = relationship("Player", back_populates="reward_transactions", lazy="joined")
    quest = relationship("Quest", lazy="selectin")

    @validates('amount')
    def validate_amount(self, key, amount):
        """Validate transaction amount is positive."""
        if amount <= 0:
            raise ValueError("Transaction amount must be positive")
        return amount

    @validates('status')
    def validate_status(self, key, status):
        """Validate transaction status is valid."""
        valid_statuses = {"pending", "success", "failed"}
        if status not in valid_statuses:
            raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")
        return status

    @validates('tx_id')
    def validate_tx_id(self, key, tx_id):
        """Validate transaction ID is not empty."""
        if not tx_id or not tx_id.strip():
            raise ValueError("Transaction ID cannot be empty")
        return tx_id.strip()

    def __repr__(self):
        return (f"<PiRewardTransaction tx_id={self.tx_id} player_id={self.player_id} "
                f"status={self.status}>")


class PiAuthLog(Base, TimestampMixin):
    """
    Model for logging Pi Network authentication events.
    """
    __tablename__ = "pi_auth_logs"
    __table_args__ = (
        Index("ix_pi_auth_player", "player_id"),
        Index("ix_pi_auth_event", "event_type"),
        Index("ix_pi_auth_created", "created_at"),
        CheckConstraint("LENGTH(event_type) >= 3", name="ck_pi_auth_event_length"),
    )

    id = Column(Integer, primary_key=True)
    player_id = Column(Integer, ForeignKey("players.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(32), nullable=False)
    pi_uid = Column(String(128), nullable=False)
    auth_token = Column(String(512), nullable=True)
    event_metadata = Column(JSON, nullable=True)

    # Relationships
    player = relationship("Player", back_populates="auth_logs", lazy="joined")

    @validates('event_type')
    def validate_event_type(self, key, event_type):
        """Validate event type format."""
        if not event_type or len(event_type) < 3:
            raise ValueError("Event type must be at least 3 characters long")
        return event_type.lower()

    @validates('pi_uid')
    def validate_pi_uid(self, key, pi_uid):
        """Validate Pi Network user ID."""
        if not pi_uid or len(pi_uid) < 8:
            raise ValueError("Pi UID must be at least 8 characters long")
        return pi_uid

    @validates('event_metadata')
    def validate_event_metadata(self, key, event_metadata):
        """Validate event metadata JSON structure."""
        if event_metadata is not None and not isinstance(event_metadata, dict):
            raise ValueError("Event metadata must be a valid JSON object")
        return event_metadata

    def __repr__(self):
        return (f"<PiAuthLog player_id={self.player_id} event_type={self.event_type} "
                f"at={self.created_at}>")
