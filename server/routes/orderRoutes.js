const express = require("express");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  updateOrderStatus,
  getOrderStatus,
  getUserOrders,
  getOrderInvoice,// ✅ Fetch user's orders
} = require("../Controllers/orderController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Route to create a Razorpay order
router.post("/razorpay-order", verifyToken, createRazorpayOrder);

// Route to verify Razorpay payment
router.post("/verify-payment", verifyToken, verifyRazorpayPayment);

// Route to update the order status
router.put("/update/:id", updateOrderStatus);

// Route to get the current order status
router.get("/status/:id", getOrderStatus);

// Route to fetch user orders
router.get("/my-orders", verifyToken, getUserOrders);

router.get("/invoice/:id", verifyToken, getOrderInvoice);


module.exports = router;
