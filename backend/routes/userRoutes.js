const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Hardcoded admin credentials
const adminCredentials = {
    username: 'AJJI',
    password: 'Onepiece'
};

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        req.session.user = { username, isAdmin: true };
        return res.redirect('/');
    }

    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            return res.redirect('/');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Register Route (for non-admin users)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, isAdmin: false });
    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
