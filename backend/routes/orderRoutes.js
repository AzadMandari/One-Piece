const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Place an order
router.post('/checkout', async (req, res) => {
    const { cart } = req.session;
    if (!cart || cart.length === 0) {
        return res.status(400).send('Cart is empty');
    }

    try {
        const orderItems = await Promise.all(cart.map(async item => {
            const product = await Product.findById(item.productId);
            if (product) {
                return {
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price
                };
            }
        }));

        const totalPrice = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        const order = new Order({
            user: req.session.user._id,
            items: orderItems,
            totalPrice
        });

        await order.save();
        req.session.cart = [];
        res.send('Order placed successfully!');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
