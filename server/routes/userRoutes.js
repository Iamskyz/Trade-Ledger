const express = require('express');
const { registerUser, loginUser, getUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser); // Register new user
router.post('/login', loginUser); // User login
router.get('/:id', getUser); // Get user details by ID

module.exports = router;
