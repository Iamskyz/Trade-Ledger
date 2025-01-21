const { DataTypes } = require("sequelize"); // Import DataTypes
const { sequelize } = require("../config/db"); // Import your Sequelize instance

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true, // This allows storing the image URL in the database
    },
  },
  {
    timestamps: true, // Automatically include createdAt and updatedAt fields
  }
);

module.exports = Product;
