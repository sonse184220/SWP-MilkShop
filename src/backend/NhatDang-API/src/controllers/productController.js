const connection = require('../utils/db');

const getAllProducts = (callback) => {
    const query = 'SELECT * FROM PRODUCT';
    connection.query(query, callback);
};

const getProductById = (productId, callback) => {
    const query = 'SELECT * FROM PRODUCT WHERE ProductID = ?';
    connection.query(query, [productId], callback);
};

module.exports = {
    getAllProducts,
    getProductById
};
