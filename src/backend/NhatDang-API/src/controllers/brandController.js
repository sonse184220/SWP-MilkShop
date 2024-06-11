const connection = require('../utils/db');

const getAllBrands = (callback) => {
    const query = 'SELECT * FROM BRAND';
    connection.query(query, callback);
};

module.exports = {
    getAllBrands
};
