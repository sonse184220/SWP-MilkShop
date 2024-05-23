import mysql from 'mysql2/promise';
// Tạo kết nối đến database bằng pool
export const poolConnect = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '12345',
    database: 'Milk_Shop',
});
