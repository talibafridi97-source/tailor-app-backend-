const express = require('express');
const router = express.Router();
const { getItems, addItem, deleteItem } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getItems)
  .post(protect, addItem);

router.route('/:id')
  .delete(protect, deleteItem);

module.exports = router;