const { quests } = require('../models/questModel');

exports.getAllQuests = (req, res) => {
  res.json(quests);
};

exports.getQuestById = (req, res) => {
  const quest = quests.find(q => q.id === +req.params.id);
  quest ? res.json(quest) : res.status(404).json({ error: 'Not found' });
};
