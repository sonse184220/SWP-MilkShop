const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345',
    database: 'Milk_Shop'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to database successfuly on localhost:3306');
});

module.exports = connection;
