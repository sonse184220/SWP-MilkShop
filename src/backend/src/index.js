import express from "express";
import session from "express-session";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from "cors";
import passport from './utils/passportConfig.js';
import { configureSocket } from './utils/socketConfig.js';
import { chatRoutes } from './routes/chatRoutes.js';
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
import { userReportRoutes } from "./routes/userreportRoutes.js";
import { adminRoutes } from './routes/adminRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 4500;

const app = express();
app.use(passport.initialize());

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const io = configureSocket(server);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reset-password', resetPasswordRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/chat', chatRoutes);
app.use(productRoutes);
app.use(blogRoutes);
app.use(wishlistRoutes);
app.use(preorderRoutes);
app.use(userReportRoutes);

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
