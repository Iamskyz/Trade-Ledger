const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// Get all orders
const getAllOrders = async (req, res) => {
    console.log("Backend: Received request to fetch all orders"); // Debug log
  
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: Product,
            attributes: ["name", "price", "image_url"], // Select specific product fields
          },
          {
            model: User,
            attributes: ["name", "email"], // Select specific user fields
          },
        ],
        order: [["createdAt", "DESC"]], // Latest orders first
      });
  
      console.log("Backend: Orders fetched successfully", orders); // Debug log
      res.status(200).json(orders);
    } catch (error) {
      console.error("Backend: Error fetching orders", error); // Debug log
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  };
  

// Update order status
const updateOrderStatus = async (req, res) => {
    const { id } = req.params; // Order ID
    const { status } = req.body;

    console.log(`Backend: Received request to update order ID ${id} to status ${status}`);
    try {
        const order = await Order.findByPk(id);

        if (!order) {
            console.log("Backend: Order not found");
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        console.log("Backend: Order status updated successfully", order);
        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        console.error("Backend: Error updating order status", error);
        res.status(500).json({ message: "Failed to update order status" });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    const { id } = req.params;

    console.log(`Backend: Received request to delete order ID ${id}`);
    try {
        const deleted = await Order.destroy({ where: { id } });

        if (!deleted) {
            console.log("Backend: Order not found");
            return res.status(404).json({ message: "Order not found" });
        }

        console.log("Backend: Order deleted successfully");
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Backend: Error deleting order", error);
        res.status(500).json({ message: "Failed to delete order" });
    }
};

module.exports = { getAllOrders, updateOrderStatus, deleteOrder };
