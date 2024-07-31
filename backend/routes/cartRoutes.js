const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Add item to cart
router.post('/add', async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cartItem = {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: parseInt(quantity, 10),
            imageUrl: product.imageUrl
        };

        if (!req.session.cart) {
            req.session.cart = [];
        }

        const existingItemIndex = req.session.cart.findIndex(item => item.product.toString() === product._id.toString());
        if (existingItemIndex > -1) {
            req.session.cart[existingItemIndex].quantity += cartItem.quantity;
        } else {
            req.session.cart.push(cartItem);
        }

        res.redirect('/shopping-cart');  // Redirect to shopping cart page
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove item from cart
router.post('/remove', (req, res) => {
    const { productId } = req.body;
    if (!req.session.cart) {
        req.session.cart = [];
    }

    req.session.cart = req.session.cart.filter(item => item.product.toString() !== productId);
    res.redirect('/shopping-cart');
});

// Update item quantity in cart
router.post('/update', (req, res) => {
    const { productId, quantity } = req.body;
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const existingItemIndex = req.session.cart.findIndex(item => item.product.toString() === productId);
    if (existingItemIndex > -1) {
        req.session.cart[existingItemIndex].quantity = parseInt(quantity, 10);
    }

    res.redirect('/shopping-cart');
});

// Get cart items
router.get('/', (req, res) => {
    const cart = req.session.cart || [];
    res.render('shoppingCart', { cart });
});

module.exports = router;
