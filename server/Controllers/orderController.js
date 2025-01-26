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
    // Create a new order in Razorpay
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

// Place a New Order (Razorpay Verification)
const placeOrder = async (req, res) => {
  const {
    product_id,
    quantity,
    total_price,
    address,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  } = req.body;
  const user_id = req.user?.id; // Extract user_id from the token

  console.log("Backend received data:", {
    product_id,
    quantity,
    total_price,
    address,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    user_id,
  });

  if (!user_id) {
    console.log("User ID is missing");
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    // Step 1: Verify Razorpay Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Invalid Razorpay signature");
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Step 2: Check if the product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    // Step 3: Check stock availability
    if (product.quantity < quantity) {
      console.log("Insufficient stock for product:", product.name);
      return res.status(400).json({ message: "Insufficient stock for this product" });
    }

    // Step 4: Deduct the stock
    product.quantity -= quantity;
    await product.save();

    // Step 5: Create a unique order code
    const unique_order_code = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Step 6: Save the order in the database
    const newOrder = await Order.create({
      user_id,
      product_id,
      quantity,
      total_price,
      address,
      unique_order_code,
      status: "Completed", // Mark as completed since payment is successful
    });

    console.log("Order placed successfully:", newOrder);

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order", error });
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

module.exports = { placeOrder, updateOrderStatus, getOrderStatus, createRazorpayOrder };
