const express = require('express');
const router = express.Router();

// Handle checkout form submission and redirect to order summary
router.post('/confirm', (req, res) => {
    const { name, email, address, phone } = req.body;
    const order = {
        name,
        email,
        address,
        phone
    };
    req.session.order = order;
    res.redirect('/checkout/summary');
});

// Display the order summary
router.get('/summary', (req, res) => {
    const order = req.session.order;
    const cart = req.session.cart || [];
    if (!order || cart.length === 0) {
        return res.redirect('/shopping-cart');
    }
    res.render('orderSummary', { order, cart });
});

// Complete the order
router.post('/complete', (req, res) => {
    // Clear the cart and order information (simulate order completion)
    req.session.cart = [];
    req.session.order = null;
    res.send('<h1>Thank you for your order!</h1><p>Your order has been placed successfully.</p>');
});

module.exports = router;
