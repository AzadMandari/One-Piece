const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Item = require('../models/Item');

// Hard-coded admin credentials
const adminCredentials = {
    username: 'AJJI',
    password: 'Onepiece'
};

// Admin login page
router.get('/login', (req, res) => {
    res.render('adminLogin');
});

// Handle admin login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === adminCredentials.username && password === adminCredentials.password) {
        req.session.isAdmin = true;
        req.session.user = { username, isAdmin: true };
        return res.redirect('/admin/dashboard');
    } else {
        return res.render('adminLogin', { error: 'Invalid credentials' });
    }
});

// Admin dashboard
router.get('/dashboard', (req, res) => {
    if (req.session.user && req.session.user.isAdmin) {
        res.render('adminDashboard', { user: req.session.user });
    } else {
        res.status(403).send('Access denied');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Manage Categories
router.get('/categories', async (req, res) => {
    if (req.session.isAdmin) {
        try {
            const categories = await Category.find();
            res.render('adminCategories', { categories });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(403).send('Access denied');
    }
});

router.post('/categories', async (req, res) => {
    if (req.session.isAdmin) {
        const { name } = req.body;
        try {
            const category = new Category({ name });
            await category.save();
            res.redirect('/admin/categories');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(403).send('Access denied');
    }
});

router.post('/categories/:id/update', async (req, res) => {
    if (req.session.isAdmin) {
        const { name } = req.body;
        try {
            await Category.findByIdAndUpdate(req.params.id, { name });
            res.redirect('/admin/categories');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(403).send('Access denied');
    }
});

router.post('/categories/:id/delete', async (req, res) => {
    if (req.session.isAdmin) {
        try {
            await Category.findByIdAndDelete(req.params.id);
            res.redirect('/admin/categories');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(403).send('Access denied');
    }
});

// Manage Items
router.get('/items', async (req, res) => {
    if (req.session.isAdmin) {
        try {
            const items = await Item.find().populate('category');
            res.render('adminItems', { items });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(403).send('Access denied');
    }
});

router.post('/items', async (req, res) => {
    if (req.session.isAdmin) {
        const { name, description, price, category, stock, imageUrl } = req.body;
        try {
            const item = new Item({ name, description, price, category, stock, imageUrl });
            await item.save();
            res.redirect('/admin/items');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(403).send('Access denied');
    }
});

router.post('/items/:id/update', async (req, res) => {
    if (req.session.isAdmin) {
        const { name, description, price, category, stock, imageUrl } = req.body;
        try {
            await Item.findByIdAndUpdate(req.params.id, { name, description, price, category, stock, imageUrl });
            res.redirect('/admin/items');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(403).send('Access denied');
    }
});

router.post('/items/:id/delete', async (req, res) => {
    if (req.session.isAdmin) {
        try {
            await Item.findByIdAndDelete(req.params.id);
            res.redirect('/admin/items');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(403).send('Access denied');
    }
});

module.exports = router;
