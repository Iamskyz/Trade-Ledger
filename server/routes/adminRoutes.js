const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check if the password is valid
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if an admin already exists with the same email
        const adminExists = await Admin.findOne({ where: { email } });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin
        const newAdmin = await Admin.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate JWT token for the new admin
        const token = jwt.sign({ id: newAdmin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the response with the token
        res.status(201).json({ token, message: 'Admin created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
