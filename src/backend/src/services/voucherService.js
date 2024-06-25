import { connection } from '../utils/dbConnection.js';

export class VoucherService {
    getAvailableVouchers = (callback) => {
        const query = 'SELECT * FROM VOUCHER WHERE VoucherQuantity > 0 AND Expiration > NOW()';
        connection.query(query, callback);
    };

    useVoucher = (voucherId, callback) => {
        const query = 'UPDATE VOUCHER SET VoucherQuantity = VoucherQuantity - 1 WHERE VoucherID = ?';
        connection.query(query, [voucherId], callback);
    };

    getVoucherDiscount = (voucherId, callback) => {
        const query = 'sElECT Discount FROM VOUCHER WHERE VoucherID = ?';
        connection.query(query, [voucherId], (err, results) => {
            if (err) return callback(err);
            if (results.length === 0) return callback(new Error('Voucher not found'));
            callback(null, results[0].Discount);
        });
    };
}
