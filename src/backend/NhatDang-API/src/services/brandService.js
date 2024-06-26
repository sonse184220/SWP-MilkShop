import connection from '../utils/db.js';

export const getAllBrands = (callback) => {
    const query = 'SELECT * FROM BRAND';
    connection.query(query, callback);
};
