const express = require("express");
const {
  getDashboardSummary,
  getOrderStatusBreakdown,
  getRecentOrders,
  getLowStockProducts,
} = require("../Controllers/adminDashboardController");

const router = express.Router();

router.get("/summary", getDashboardSummary);
router.get("/orders/status", getOrderStatusBreakdown);
router.get("/orders/recent", getRecentOrders);
router.get("/products/low-stock", getLowStockProducts);

module.exports = router;
