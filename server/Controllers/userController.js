const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
const registerUser = async (req, res) => {
    const { name, email, password, mobile_number, address } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        mobile_number,
        address
    });

    res.status(201).json({
        message: 'User created successfully',
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    });
};

// User login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
        message: 'Login successful',
        token
    });
};

// Get user by ID
const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);  // Find user by primary key (ID)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User found',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile_number: user.mobile_number,
                address: user.address
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
};

module.exports = { registerUser, loginUser, getUser };
