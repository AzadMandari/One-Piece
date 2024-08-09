const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');  // Import cart routes
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Admin routes for CRUD operations
const Product = require('./models/Product');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoUri = 'mongodb+srv://mandariazad6666:aSSNGPDJA1@cluster0.htk49su.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => console.log(err));

app.use(session({
    secret: '1234',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoUri })
}));

// User Routes
app.use('/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/cart', cartRoutes);  // Use cart routes
app.use('/order', orderRoutes); // Use order routes

// Admin Routes
app.use('/admin', adminRoutes); // Routes for admin login and dashboard

// Home Page
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        const categories = [...new Set(products.map(product => product.category))];
        res.render('index', { products, categories, user: req.session.user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// User Authentication Routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Admin Authentication and Dashboard Route
app.get('/admin', (req, res) => {
    if (req.session.user && req.session.user.isAdmin) {
        res.render('admin');
    } else {
        res.status(403).send('Access denied');
    }
});

// Shopping Cart Routes
app.get('/shopping-cart', (req, res) => {
    const cart = req.session.cart || [];
    res.render('shoppingCart', { cart });
});

// Checkout Routes
app.get('/checkout', (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
        return res.redirect('/shopping-cart');
    }
    res.render('checkout');
});

app.post('/checkout/confirm', (req, res) => {
    const { name, email, address, phone } = req.body;
    const order = {
        name,
        email,
        address,
        phone
    };
    req.session.order = order;
    res.redirect('/order/summary');
});

app.get('/order/summary', (req, res) => {
    const order = req.session.order;
    const cart = req.session.cart || [];
    if (!order || cart.length === 0) {
        return res.redirect('/shopping-cart');
    }
    res.render('orderSummary', { order, cart });
});

app.post('/order/complete', (req, res) => {
    req.session.cart = [];
    req.session.order = null;
    res.send('<h1>Thank you for your order!</h1><p>Your order has been placed successfully.</p>');
});

// Category Routes
app.get('/category/mobile-cases', async (req, res) => {
    try {
        const products = await Product.find({ category: 'Mobile Cases' });
        res.render('mobileCases', { products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/category/clothes', async (req, res) => {
    try {
        const products = await Product.find({ category: 'Clothes' });
        res.render('clothes', { products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/category/wall-posters', async (req, res) => {
    try {
        const products = await Product.find({ category: 'Wall Posters' });
        res.render('wallPosters', { products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/category/toys', async (req, res) => {
    try {
        const products = await Product.find({ category: 'Toys' });
        res.render('toys', { products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Product Details Route
app.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('productDetails', { product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin CRUD Operations for Categories and Items
app.use('/admin', adminRoutes); // Ensure this is present to load all admin-specific routes

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
