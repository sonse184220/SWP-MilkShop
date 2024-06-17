import express from "express";
import session from "express-session";

import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from "cors"; // Import CORS middleware

// import { authRoutes } from './routes/authRoutes.js';
import { brandRoutes } from './routes/brandRoutes.js';
import { productRoutes } from "./routes/productRoutes.js";
import { blogRoutes } from "./routes/blogRoutes.js";
import { wishlistRoutes } from "./routes/wishlistRoutes.js";

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
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json()); // dùng json
app.use(bodyParser.json());

// API liên quan đến product
app.use(productRoutes);

// API liên quan đến blogs
app.use(blogRoutes);

// API liên quan đến wishlist
app.use(wishlistRoutes);


// app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
// app.use('/api/reset-password', resetPasswordRoutes);
app.use('/api/brand', brandRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/logout', logoutRoutes);




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



