#!/usr/bin/env python3
"""
Palace of Quests - Main Application Entry Point
Web3 Metaverse Game Backend for Pi Network
"""

import os
from app import create_app
from app.extensions import db
from app.models import User, Quest, QuestProgress, UserQuest, Item, Transaction

app = create_app()

@app.shell_context_processor
def make_shell_context():
    """Make database models available in Flask shell"""
    return {
        'db': db,
        'User': User,
        'Quest': Quest,
        'QuestProgress': QuestProgress,
        'UserQuest': UserQuest,
        'Item': Item,
        'Transaction': Transaction
    }

@app.cli.command()
def init_db():
    """Initialize the database with sample data"""
    db.create_all()
    
    # Create sample quests
    sample_quests = [
        Quest(
            title="First Steps",
            description="Complete your first quest in the Palace of Quests metaverse",
            difficulty="Easy",
            pi_reward=1.0,
            experience_reward=100,
            level_requirement=1,
            quest_type="tutorial"
        ),
        Quest(
            title="Crystal Hunter",
            description="Collect 10 mystical crystals from the Crystal Caverns",
            difficulty="Medium",
            pi_reward=5.0,
            experience_reward=500,
            level_requirement=5,
            quest_type="collection"
        ),
        Quest(
            title="Dragon Slayer",
            description="Defeat the Ancient Dragon in the Shadow Realm",
            difficulty="Hard",
            pi_reward=25.0,
            experience_reward=2000,
            level_requirement=15,
            quest_type="combat"
        )
    ]
    
    for quest in sample_quests:
        existing = Quest.query.filter_by(title=quest.title).first()
        if not existing:
            db.session.add(quest)
    
    # Create sample items
    sample_items = [
        Item(
            name="Mystic Sword",
            description="A legendary sword imbued with Pi Network energy",
            item_type="weapon",
            rarity="Epic",
            pi_price=10.0,
            stats={"attack": 50, "magic": 25}
        ),
        Item(
            name="Crystal Shield",
            description="A protective shield made from rare crystals",
            item_type="armor",
            rarity="Rare",
            pi_price=7.5,
            stats={"defense": 40, "magic_resist": 20}
        ),
        Item(
            name="Health Elixir",
            description="Restores full health instantly",
            item_type="consumable",
            rarity="Common",
            pi_price=2.0,
            stats={"healing": 100}
        )
    ]
    
    for item in sample_items:
        existing = Item.query.filter_by(name=item.name).first()
        if not existing:
            db.session.add(item)
    
    db.session.commit()
    print("✅ Database initialized with sample data!")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
