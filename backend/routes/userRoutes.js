const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Login Route for Users
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    res.render('/adminDashboard.ejs');
   /* try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            return res.redirect('/');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }*/
});


// Logout Route for Users
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Register Route for Users
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
