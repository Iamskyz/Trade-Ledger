const express = require("express");
const {
  createRazorpayOrder,
  verifyRazorpayPayment, // Make sure this is properly imported
  updateOrderStatus,
  getOrderStatus,
} = require("../Controllers/orderController");
const verifyToken = require("../middleware/verifyToken"); // Import middleware
const router = express.Router();

// Route to create a Razorpay order
router.post("/razorpay-order", verifyToken, createRazorpayOrder);

// Route to verify Razorpay payment
router.post("/verify-payment", verifyToken, verifyRazorpayPayment);

// Route to update the order status
router.put("/update/:id", updateOrderStatus);

// Route to get the current order status
router.get("/status/:id", getOrderStatus);

module.exports = router;
