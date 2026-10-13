const express = require('express');
const router = express.Router();
const { createCustomerOrder } = require('../controllers/customerOrderController');

router.post('/', createCustomerOrder);

module.exports = router;
