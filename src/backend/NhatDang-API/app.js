const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const resetPasswordRoutes = require('./src/routes/resetPasswordRoutes');
const brandRoutes = require('./src/routes/brandRoutes');
const cartRoutes = require('./src/routes/cartRoutes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4500;

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/reset-password', resetPasswordRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/cart', cartRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
