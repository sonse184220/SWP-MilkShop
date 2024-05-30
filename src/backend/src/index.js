import express from "express";

import bodyParser from 'body-parser';
import {authRoutes} from './routes/authRoutes.js';
import {brandRoutes} from './routes/brandRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

import { productRoutes } from "./routes/productRoutes.js";
import { blogRoutes } from "./routes/blogRoutes.js";
import cors from "cors"; // Import CORS middleware


const PORT = process.env.PORT || 3000; // cổng kết nối localhost:xxxx

const app = express(); // khởi chạy express
app.use(express.json()); // dùng json
app.use(bodyParser.json());

// Enable CORS for specific origin
app.use(cors({ origin: 'http://localhost:3000' }));

// API liên quan đến product
app.use(productRoutes);

// API liên quan đến blogs
app.use(blogRoutes);

app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/brand', brandRoutes);




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

// Enable CORS for specific origin
app.use(cors({ origin: 'http://localhost:3000' }));

