const Product = require('../models/Product');

// Add a new product
const addProduct = async (req, res) => {
    const { name, price, quantity } = req.body;

    const newProduct = await Product.create({
        name,
        price,
        quantity
    });

    res.status(201).json({
        message: 'Product added successfully',
        product: newProduct
    });
};

// Get product by ID
const getProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
};

// Update product by ID
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;

    await product.save();

    res.status(200).json({ message: 'Product updated', product });
};

// Get all products
const getAllProducts = async (req, res) => {
    const products = await Product.findAll();
    res.status(200).json(products);
};

module.exports = { addProduct, getProduct, updateProduct, getAllProducts };
