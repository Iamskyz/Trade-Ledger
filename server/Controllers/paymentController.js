const Razorpay = require("razorpay");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay key ID
  key_secret: process.env.RAZORPAY_SECRET, // Replace with your Razorpay secret
});

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body; // Amount should be in the request body

  try {
    // Convert amount to the smallest currency unit (paise for INR)
    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`, // Unique receipt ID
    };

    // Generate order from Razorpay
    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create Razorpay order" });
  }
};

module.exports = { createRazorpayOrder };
