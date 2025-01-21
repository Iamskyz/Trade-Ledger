const Order = require("../models/Order");
const Product = require("../models/Product");

// Place a New Order
const placeOrder = async (req, res) => {
  const { product_id, quantity, total_price, address } = req.body;
  const user_id = req.user?.id; // Extract user_id from the token

  // Log received data for debugging
  console.log("Backend received data:", { product_id, quantity, total_price, address, user_id });

  if (!user_id) {
    console.log("User ID is missing");
    return res.status(401).json({ message: "Unauthorized access" });
  }

  if (!product_id || !quantity || !total_price || !address) {
    console.log("Invalid order data:", { product_id, quantity, total_price, address });
    return res.status(400).json({ message: "Invalid order data" });
  }

  try {
    // Check if the product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product has sufficient stock
    if (product.quantity < quantity) {
      console.log("Insufficient stock for product:", product.name);
      return res.status(400).json({ message: "Insufficient stock for this product" });
    }

    // Deduct the ordered quantity from the product stock
    product.quantity -= quantity;
    await product.save();

    // Create a unique order code
    const unique_order_code = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create a new order
    const newOrder = await Order.create({
      user_id,
      product_id,
      quantity,
      total_price,
      address,
      unique_order_code,
      status: "Pending",
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



// Existing functions
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { order_status } = req.body;

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = order_status;
        await order.save();

        res.status(200).json({
            message: 'Order status updated successfully',
            order,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error });
    }
};

const getOrderStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            message: 'Order status retrieved successfully',
            order_status: order.status,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve order status', error });
    }
};

module.exports = { placeOrder, updateOrderStatus, getOrderStatus };
