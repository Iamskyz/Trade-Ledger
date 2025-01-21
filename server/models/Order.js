const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Products',
            key: 'id'
        },
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT, // Address field added
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Completed', 'Canceled'),
        defaultValue: 'Pending'
    },
    unique_order_code: {
        type: DataTypes.STRING,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = Order;
