const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers, deleteCustomer, updateCustomer } = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createCustomer)
  .get(protect, getCustomers);

router.route('/:id')
  .put(protect, updateCustomer) // <--- EDIT KE LIYE
  .delete(protect, deleteCustomer);

module.exports = router;