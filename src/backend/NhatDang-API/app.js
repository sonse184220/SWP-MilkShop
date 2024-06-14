import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import resetPasswordRoutes from './src/routes/resetPasswordRoutes.js';
import brandRoutes from './src/routes/brandRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import logoutRoutes from './src/routes/logoutRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

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
app.use('/api/logout', logoutRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
