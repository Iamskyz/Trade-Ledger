const express = require("express");
const { getAllOrders, updateOrderStatus, deleteOrder } = require("../Controllers/orderAdminController");
const router = express.Router();

console.log("Backend: Admin order routes initialized"); // Log when routes are initialized

// Route to get all orders
router.get("/", getAllOrders);

// Route to update an order's status
router.put("/:id", updateOrderStatus);

// Route to delete an order
router.delete("/:id", deleteOrder);

module.exports = router;
