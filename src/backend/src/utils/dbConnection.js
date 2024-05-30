import mysqlPromise from 'mysql2/promise';

const mysql = require('mysql2');
require('dotenv').config();

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

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log(`Connected to the database successfully on port ${port}`);
});
poolConnect.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log(`Connected to the database successfully on port ${port}`);
});