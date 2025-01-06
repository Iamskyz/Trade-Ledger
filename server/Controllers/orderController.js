const Order = require('../models/Order');

// Update Order Status
const updateOrderStatus = async (req, res) => {
    const { id } = req.params; // Order ID
    const { order_status } = req.body; // New order status (Pending, Completed, Canceled)

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order_status
        order.order_status = order_status;
        await order.save();

        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error });
    }
};

// Get Order Status
const getOrderStatus = async (req, res) => {
    const { id } = req.params; // Order ID

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            message: 'Order status retrieved successfully',
            order_status: order.order_status
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve order status', error });
    }
};

module.exports = { updateOrderStatus, getOrderStatus };
