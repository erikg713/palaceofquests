user = User.query.get(user_id)
quest = Quest.query.get(quest_id)
if user.can_start_quest(quest):
    user_quest = UserQuest(user_id=user.id, quest_id=quest.id)
    db.session.add(user_quest)
    db.session.commit()
