const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Admin registration
const registerAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if the admin already exists
    const adminExists = await Admin.findOne({ where: { email } });
    if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = await Admin.create({
        name,
        email,
        password: hashedPassword,
        role
    });

    res.status(201).json({
        message: 'Admin created successfully',
        admin: {
            id: newAdmin.id,
            name: newAdmin.name,
            email: newAdmin.email
        }
    });
};

// Admin login
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
        return res.status(400).json({ message: 'Admin not found' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, {
        expiresIn: '1h' // Token expires in 1 hour
    });

    res.status(200).json({
        message: 'Login successful',
        token
    });
};

module.exports = { registerAdmin, loginAdmin };
