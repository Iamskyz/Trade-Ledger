const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,      // Database name (shop_management_system)
    process.env.DB_USER,      // Database user (root)
    process.env.DB_PASSWORD,  // Database password (Aakash@123)
    {
        host: process.env.DB_HOST,  // Database host (localhost)
        dialect: 'mysql',           // Dialect is MySQL
        logging: false              // Disable logging for Sequelize
    }
);

// Function to test database connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();  // Test the connection
        console.log('MySQL connected...');
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
        process.exit(1);  // Exit the process if the connection fails
    }
};

module.exports = { sequelize, connectDB };
