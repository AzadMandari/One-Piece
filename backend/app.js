const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');  // Import cart routes
const orderRoutes = require('./routes/orderRoutes');
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
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoUri })
}));

app.use('/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/cart', cartRoutes);  // Use cart routes
app.use('/order', orderRoutes);

app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        const categories = [...new Set(products.map(product => product.category))];
        res.render('index', { products, categories, user: req.session.user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/admin', (req, res) => {
    if (req.session.user && req.session.user.isAdmin) {
        res.render('admin');
    } else {
        res.status(403).send('Access denied');
    }
});

app.get('/shopping-cart', (req, res) => {
    const cart = req.session.cart || [];
    res.render('shoppingCart', { cart });
});

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
