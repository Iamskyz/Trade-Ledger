const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/orders", require("./routes/orderAdminRoutes"));
app.use("/api/admin/users", require("./routes/userAdminRoutes"));
app.use("/api/admin/dashboard", require("./routes/adminDashboardRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

const startServer = async () => {
  try {
    const User = require("./models/User");
    const Product = require("./models/Product");
    const Order = require("./models/Order");
    const Admin = require("./models/Admin");

    Order.belongsTo(Product, { foreignKey: "product_id" });
    Order.belongsTo(User, { foreignKey: "user_id" });

    await Promise.all([
      User.sync(),
      Product.sync(), // Disable `alter` for Products
      Order.sync({ alter: true }),
      Admin.sync(),
    ]);

    console.log("Models synced with MySQL database.");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error syncing models:", error);
  }
};

startServer();
