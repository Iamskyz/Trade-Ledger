const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// Add a New Product
router.post("/", async (req, res) => {
    const { name, price, quantity, description, image_url } = req.body;

    try {
        const newProduct = await Product.create({
            name,
            price,
            quantity,
            description,
            image_url, // Save the image URL in the database
        });

        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Error adding product" });
    }
});

// Get All Products
router.get("/", async (req, res) => {
    try {
        const products = await Product.findAll(); // Fetch all products from the database
        res.status(200).json(products); // Send the products to the frontend
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
});

// Delete a Product
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.destroy({ where: { id } });

        if (product === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product" });
    }
});

// Update a Product
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity, description, image_url } = req.body;

        const product = await Product.update(
            { name, price, quantity, description, image_url }, // Update image URL
            { where: { id } }
        );

        if (product[0] === 0) {
            return res.status(404).json({ message: "Product not found or no changes made" });
        }

        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Error updating product" });
    }
});

module.exports = router;
