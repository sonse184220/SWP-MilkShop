import connection from '../utils/db.js';

export const getAllProducts = (callback) => {
    const query = 'SELECT * FROM PRODUCT';
    connection.query(query, callback);
};

export const getProductById = (productId, callback) => {
    const query = 'SELECT * FROM PRODUCT WHERE ProductID = ?';
    connection.query(query, [productId], callback);
};
