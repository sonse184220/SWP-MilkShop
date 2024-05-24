import express, { Request, Response, NextFunction } from "express";

import productsRouter from "./routes/productsRouter.js";
import blogsRouter from "./routes/blogsRouter.js";

const PORT = 3300; // tùy chọn cổng kết nối localhost:xxxx

const app = express(); // khởi chạy express
app.use(express.json()); // dùng json

/***** API có bảo mật ********/


/***** API không bảo mật ****/

// API liên quan đến products
app.use("/api/products", productsRouter);

// API liên quan đến blogs
app.use("/api/blogs", blogsRouter);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// bắt error bị lọt qua các check
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
    });
});

// đảm bảo server khởi chạy
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});