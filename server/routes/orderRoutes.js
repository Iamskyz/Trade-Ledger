const express = require("express");
const { placeOrder, updateOrderStatus, getOrderStatus } = require("../Controllers/orderController");
const verifyToken = require("../middleware/verifyToken"); // Import middleware
const router = express.Router();

// Route to place a new order (with verifyToken middleware)
router.post("/place", verifyToken, placeOrder);

// Route to update the order status
router.put("/update/:id", updateOrderStatus);

// Route to get the current order status
router.get("/status/:id", getOrderStatus);

module.exports = router;
