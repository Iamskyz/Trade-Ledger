const express = require('express');
const { updateOrderStatus, getOrderStatus } = require('../controllers/orderController');
const router = express.Router();

// Route to update the order status
router.put('/update/:id', updateOrderStatus);

// Route to get the current order status
router.get('/status/:id', getOrderStatus);

module.exports = router;
