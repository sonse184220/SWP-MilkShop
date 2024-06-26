import express from "express";
import session from "express-session";

import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from "cors"; // Import CORS middleware

import { authRoutes } from './routes/authRoutes.js';
import { brandRoutes } from './routes/brandRoutes.js';
import { productRoutes } from "./routes/productRoutes.js";
import { blogRoutes } from "./routes/blogRoutes.js";
import { wishlistRoutes } from "./routes/wishlistRoutes.js";
import { cartRoutes } from './routes/cartRoutes.js';
import { resetPasswordRoutes } from './routes/resetPasswordRoutes.js';
import { googleRoutes } from './routes/googleRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { orderRoutes } from './routes/orderRoutes.js';
import { preorderRoutes } from "./routes/preorderRoutes.js";
import { voucherRoutes } from './routes/voucherRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 3000; // cổng kết nối localhost:xxxx

const app = express(); // khởi chạy express

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Enable CORS for specific origin
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(express.json()); // dùng json
app.use(bodyParser.json());

// API liên quan đến product
app.use(productRoutes);

// API liên quan đến blogs
app.use(blogRoutes);

// API liên quan đến wishlist
app.use(wishlistRoutes);

// API liên quan đến pre-order
app.use(preorderRoutes);


app.use('/api/auth', authRoutes);
app.use('/api/reset-password', resetPasswordRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/vouchers', voucherRoutes);



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// bắt error bị lọt qua các check
app.use((err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).send({
        status: "error",
        statusCode,
        message,
    });
});

// khởi chạy server 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



