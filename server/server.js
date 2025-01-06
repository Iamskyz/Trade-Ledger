const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db'); // Correct import

dotenv.config(); // Load environment variables

const app = express();

// Middleware to handle CORS and JSON requests
app.use(cors());
app.use(express.json());

// Connect to MySQL
connectDB();

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); // Admin routes

// Synchronize Models and Start the Server
const startServer = async () => {
    try {
        // Synchronize all models with the database
        const User = require('./models/User');
        const Product = require('./models/Product');
        const Order = require('./models/Order');
        const Admin = require('./models/Admin');

        // Sync models with the database
        await User.sync({ alter: true }); // Update table schema to match the model
        await Product.sync({ alter: true });
        await Order.sync({ alter: true });
        await Admin.sync({ alter: true }); // Sync Admin model with schema updates

        console.log('Models synced with MySQL database.');

        // Start the server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Error syncing models:', error);
    }
};

startServer(); // Call to start the server
