const sequelize = require("../config/db").sequelize; // Import sequelize instance
const { Op } = require("sequelize"); // Import Op for operators like lt
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");


// Dashboard Summary
const getDashboardSummary = async (req, res) => {
    try {
      const totalUsers = await User.count();
      const totalProducts = await Product.count();
      const totalOrders = await Order.count();
      const totalRevenue = await Order.sum("total_price"); // Ensure total_price exists in the table
  
      console.log("Dashboard Summary:", { totalUsers, totalProducts, totalOrders, totalRevenue }); // Debug log
  
      res.status(200).json({ totalUsers, totalProducts, totalOrders, totalRevenue });
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      res.status(500).json({ message: "Error fetching dashboard summary" });
    }
  };
  

// Order Status Breakdown
const getOrderStatusBreakdown = async (req, res) => {
  try {
    const statuses = await Order.findAll({
      attributes: ["status", [sequelize.fn("COUNT", sequelize.col("status")), "count"]],
      group: ["status"],
    });

    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching order status breakdown:", error);
    res.status(500).json({ message: "Error fetching order status breakdown" });
  }
};

// Recent Orders
const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [{ model: Product, attributes: ["name"] }],
    });

    res.status(200).json(recentOrders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ message: "Error fetching recent orders" });
  }
};

// Low-Stock Products
const getLowStockProducts = async (req, res) => {
    try {
      const lowStockProducts = await Product.findAll({
        where: {
          quantity: { [Op.lt]: 5 }, // Products with stock less than 5
        },
        order: [["quantity", "ASC"]],
      });
  
      console.log("Low-Stock Products:", lowStockProducts); // Debug log
      res.status(200).json(lowStockProducts);
    } catch (error) {
      console.error("Error fetching low-stock products:", error);
      res.status(500).json({ message: "Error fetching low-stock products" });
    }
  };
  

module.exports = { getDashboardSummary, getOrderStatusBreakdown, getRecentOrders, getLowStockProducts };
