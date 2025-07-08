import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { requirePiAuth } from '../middleware/piAuth.js';
import InventoryController from '../controllers/inventoryController.js';

const router = express.Router();

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Validation error catcher
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /inventory - list all items
router.get(
  '/',
  requirePiAuth,
  asyncHandler(async (req, res) => {
    const items = await InventoryController.getAllItems(req.user.uid);
    res.json(items);
  })
);

// GET /inventory/:id - get one item by id
router.get(
  '/:id',
  requirePiAuth,
  param('id').isString().trim().notEmpty(),
  validate,
  asyncHandler(async (req, res) => {
    const item = await InventoryController.getItemById(req.params.id, req.user.uid);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  })
);

// POST /inventory - add new item
router.post(
  '/',
  requirePiAuth,
  body('name').isString().trim().notEmpty(),
  // Add more validation if needed
  validate,
  asyncHandler(async (req, res) => {
    const created = await InventoryController.createItem({ ...req.body, ownerUid: req.user.uid });
    res.status(201).json(created);
  })
);

// PUT /inventory/:id - update item by id
router.put(
  '/:id',
  requirePiAuth,
  param('id').isString().trim().notEmpty(),
  body('name').optional().isString().trim().notEmpty(),
  validate,
  asyncHandler(async (req, res) => {
    const updated = await InventoryController.updateItem(req.params.id, req.body, req.user.uid);
    if (!updated) return res.status(404).json({ error: 'Item not found or no permission' });
    res.json(updated);
  })
);

// DELETE /inventory/:id - delete item by id
router.delete(
  '/:id',
  requirePiAuth,
  param('id').isString().trim().notEmpty(),
  validate,
  asyncHandler(async (req, res) => {
    const deleted = await InventoryController.deleteItem(req.params.id, req.user.uid);
    if (!deleted) return res.status(404).json({ error: 'Item not found or no permission' });
    res.json({ message: 'Item deleted' });
  })
);

export default router;
