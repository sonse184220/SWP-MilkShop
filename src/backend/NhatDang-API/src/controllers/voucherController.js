import connection from '../utils/db.js';

export const getAllVouchers = (callback) => {
    const query = 'SELECT * FROM VOUCHER';
    connection.query(query, callback);
};
