const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Admin = sequelize.define(
    'Admin',
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: false, // Disable createdAt and updatedAt
    }
);

module.exports = Admin;
