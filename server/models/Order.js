const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Product = require("./Product");
const User = require("./User");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Products",
        key: "id",
      },
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.FLOAT, // Total price of the order
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Completed", "Canceled"),
      defaultValue: "Pending",
    },
    unique_order_code: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Associate the Order model with the Product and User models
Order.belongsTo(Product, { foreignKey: "product_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

module.exports = Order;
