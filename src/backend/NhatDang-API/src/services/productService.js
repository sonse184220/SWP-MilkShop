const connection = require('../utils/db');

const getAllProducts = (callback) => {
    const query = 'SELECT * FROM PRODUCT';
    connection.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const getProductById = (productId, callback) => {
    const query = 'SELECT * FROM PRODUCT WHERE ProductID = ?';
    connection.query(query, [productId], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(null, { message: 'Product not found', status: 404 });
        callback(null, results[0]);
    });
};

module.exports = { getAllProducts, getProductById };
