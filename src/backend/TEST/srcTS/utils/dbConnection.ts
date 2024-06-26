import mysqlPromise from 'mysql2/promise';

import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000

// Tạo kết nối đến database bằng pool
export const poolConnect = mysqlPromise.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


