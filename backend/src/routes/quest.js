const router = require('express').Router();
const { getAllQuests, getQuestById } = require('../controllers/questController');

router.get('/', getAllQuests);
router.get('/:id', getQuestById);

module.exports = router;
