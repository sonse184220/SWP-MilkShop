const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./src/controllers/authController').passport;
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const resetPasswordRoutes = require('./src/routes/resetPasswordRoutes');
const brandRoutes = require('./src/routes/brandRoutes');
const userRoutes = require('./src/routes/userRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4500;

app.use(bodyParser.json());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/reset-password', resetPasswordRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/user', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
