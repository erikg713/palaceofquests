const Blueprint = require('../models/Blueprint');
const logger = require('../utils/logger');

/**
 * Middleware: Load blueprint by ID and attach to req.blueprint.
 * Enforces access restrictions (ownership, level, etc.) if needed.
 */
const blueprintsMiddleware = async (req, res, next) => {
  try {
    const blueprintId = req.params.blueprintId || req.body.blueprintId;

    if (!blueprintId) {
      return res.status(400).json({ message: 'Blueprint ID is required.' });
    }

    const blueprint = await Blueprint.findById(blueprintId);

    if (!blueprint) {
      return res.status(404).json({ message: 'Blueprint not found.' });
    }

    // Optional: Check if user has permission to view/use this blueprint
    if (blueprint.owner !== req.user.uid && !blueprint.public) {
      return res.status(403).json({ message: 'Access denied to this blueprint.' });
    }

    // Optional: Check quest level/requirements
    if (blueprint.requiredLevel && req.user.level < blueprint.requiredLevel) {
      return res.status(403).json({ message: 'Insufficient level to access blueprint.' });
    }

    req.blueprint = blueprint;
    next();
  } catch (err) {
    logger.error('Blueprint access failed', { error: err.message });
    res.status(500).json({ message: 'Failed to load blueprint.' });
  }
};

module.exports = blueprintsMiddleware;

