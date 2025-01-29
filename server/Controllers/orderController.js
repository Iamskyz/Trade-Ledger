const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Razorpay = require("razorpay");

// Configure Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay key ID
  key_secret: process.env.RAZORPAY_SECRET, // Replace with your Razorpay secret
});

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  const { total_price } = req.body; // Expect `total_price` in the request body
  const amount = Math.round(total_price * 100); // Convert to smallest currency unit (e.g., paise for INR)
  const currency = "INR";

  try {
    const options = {
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

// Verify Razorpay Payment
const verifyRazorpayPayment = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    product_id,
    quantity,
    total_price,
    address,
  } = req.body;
  const user_id = req.user?.id;

  console.log("Verifying Razorpay payment with data:", {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    product_id,
    quantity,
    total_price,
    address,
    user_id,
  });

  try {
    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("Generated signature:", generatedSignature);

    if (generatedSignature !== razorpay_signature) {
      console.error("Invalid Razorpay signature");
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Check if the product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check stock availability
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock for this product" });
    }

    // Deduct stock
    product.quantity -= quantity;
    await product.save();

    // Save order in the database
    const unique_order_code = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newOrder = await Order.create({
      user_id,
      product_id,
      quantity,
      total_price,
      address,
      unique_order_code,
      status: "Completed",
    });

    console.log("Order placed successfully:", newOrder);

    res.status(201).json({
      message: "Payment verified and order placed successfully.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Payment verification failed.", error });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { order_status } = req.body;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = order_status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error });
  }
};

// Get Order Status
const getOrderStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status retrieved successfully",
      order_status: order.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve order status", error });
  }
};

module.exports = {
  updateOrderStatus,
  getOrderStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
};
