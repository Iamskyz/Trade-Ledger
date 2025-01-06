const express = require('express');
const { addProduct, getProduct, updateProduct, getAllProducts } = require('../controllers/productController');
const router = express.Router();

router.post('/add', addProduct); // Add a new product
router.get('/:id', getProduct); // Get product by ID
router.put('/update/:id', updateProduct); // Update product
router.get('/', getAllProducts); // Get all products

module.exports = router;
