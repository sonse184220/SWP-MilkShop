import express from "express";
import { productRoutes } from "./routes/productRoutes.js";
import { blogRoutes } from "./routes/blogRoutes.js";
const PORT = 3300; // tùy chọn cổng kết nối localhost:xxxx
const app = express(); // khởi chạy express
app.use(express.json()); // dùng json
// API liên quan đến products
app.use(productRoutes);
// API liên quan đến blogs
app.use(blogRoutes);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// bắt error bị lọt qua các check
app.use((err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
    });
});
// khởi chạy server 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
