const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Add a new product
router.post('/', async (req, res) => {
    const { name, description, price, category, stock, imageUrl } = req.body;
    const product = new Product({ name, description, price, category, stock, imageUrl });
    try {
        await product.save();
        res.status(201).send('Product added');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Edit a product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            Object.assign(product, req.body);
            await product.save();
            res.send('Product updated');
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.remove();
            res.send('Product deleted');
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
