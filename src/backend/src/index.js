import express from "express";

import { productRoutes } from "./routes/productRoutes.js";
import { blogRoutes } from "./routes/blogRoutes.js";
import cors from "cors"; // Import CORS middleware


const PORT = 8080; // tùy chọn cổng kết nối localhost:xxxx

const app = express(); // khởi chạy express
app.use(express.json()); // dùng json

// Enable CORS for specific origin
app.use(cors({ origin: 'http://localhost:3000' }));

// API liên quan đến product
app.use(productRoutes);

// API liên quan đến blogs
app.use(blogRoutes);




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

