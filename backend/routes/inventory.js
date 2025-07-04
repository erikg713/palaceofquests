// backend/routes/inventory.js

const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();

// Example: swap this for your real controller
// const InventoryController = require('../controllers/inventoryController');

// DRY async wrapper for cleaner error handling
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// GET /inventory - list all items
router.get(
  '/',
  asyncHandler(async (req, res) => {
    // const items = await InventoryController.getAllItems();
    const items = []; // replace with real data
    res.json(items);
  })
);

// GET /inventory/:id - fetch one item
router.get(
  '/:id',
  param('id').isString().trim().notEmpty(),
  asyncHandler(async (req, res) => {
    validationResult(req).throw();
    const { id } = req.params;
    // const item = await InventoryController.getItemById(id);
    const item = null; // replace with real data
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  })
);

// POST /inventory - create item
router.post(
  '/',
  body('name').isString().trim().notEmpty(),
  // Add more validation as needed
  asyncHandler(async (req, res) => {
    validationResult(req).throw();
    const newItem = req.body;
    // const created = await InventoryController.createItem(newItem);
    const created = newItem; // replace with real logic
    res.status(201).json(created);
  })
);

// PUT /inventory/:id - update item
router.put(
  '/:id',
  param('id').isString().trim().notEmpty(),
  body('name').optional().isString().trim().notEmpty(),
  asyncHandler(async (req, res) => {
    validationResult(req).throw();
    const { id } = req.params;
    const updates = req.body;
    // const updated = await InventoryController.updateItem(id, updates);
    const updated = updates; // replace with real logic
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  })
);

// DELETE /inventory/:id - delete item
router.delete(
  '/:id',
  param('id').isString().trim().notEmpty(),
  asyncHandler(async (req, res) => {
    validationResult(req).throw();
    const { id } = req.params;
    // const deleted = await InventoryController.deleteItem(id);
    const deleted = true; // replace with real logic
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  })
);

module.exports = router;
