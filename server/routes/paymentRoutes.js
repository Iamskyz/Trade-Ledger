const express = require("express");
const { createRazorpayOrder } = require("../Controllers/paymentController");

const router = express.Router();

// Route to create a Razorpay order
router.post("/create-order", createRazorpayOrder);

module.exports = router;
