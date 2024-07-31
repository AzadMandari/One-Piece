const express = require('express');
const router = express.Router();

// Add to cart
router.post('/add', (req, res) => {
    const { productId, quantity } = req.body;
    if (!req.session.cart) {
        req.session.cart = [];
    }
    const productIndex = req.session.cart.findIndex(item => item.productId === productId);
    if (productIndex > -1) {
        req.session.cart[productIndex].quantity += quantity;
    } else {
        req.session.cart.push({ productId, quantity });
    }
    res.send('Product added to cart');
});

// View cart
router.get('/', (req, res) => {
    res.json(req.session.cart || []);
});

// Remove from cart
router.post('/remove', (req, res) => {
    const { productId } = req.body;
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(item => item.productId !== productId);
    }
    res.send('Product removed from cart');
});

// Update cart
router.post('/update', (req, res) => {
    const { productId, quantity } = req.body;
    if (req.session.cart) {
        const productIndex = req.session.cart.findIndex(item => item.productId === productId);
        if (productIndex > -1) {
            req.session.cart[productIndex].quantity = quantity;
        }
    }
    res.send('Cart updated');
});

module.exports = router;
