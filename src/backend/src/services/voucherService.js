import { connection, poolConnect } from '../utils/dbConnection.js';

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

    async getAllVouchers(limit, sortBy, offset) {
        const [vouchers] = await poolConnect.query(`SELECT * FROM voucher ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [limit, offset])
        return vouchers;
    }

    async getVoucher(voucherId) {
        const [voucher] = await poolConnect.query("SELECT * FROM voucher WHERE VoucherID = ?", [voucherId]);
        return voucher;
    }
    async getTotalVoucher() {
        const [total] = await poolConnect.query("SELECT COUNT(*) as count FROM voucher");
        const count = total[0].count;
        return count;
    }

    async createVoucher(discount, quantity, expiration, content) {
        const [voucher] = await poolConnect.query(`INSERT INTO voucher (Discount, VoucherQuantity, Expiration, Content) 
                                                VALUES (?,?,?,?)`, [discount, quantity, expiration, content]);
        return voucher;
    }

    async updateVoucher(voucherId, updateQuery, updateValue) {
        const [updatedVoucher] = await poolConnect.query(`UPDATE voucher SET ${updateQuery.join(", ")} WHERE VoucherID = ?`, [...updateValue, voucherId]);
        return updatedVoucher;
    }

    async deleteVoucher(voucherId) {
        const [result] = await poolConnect.query(`DELETE FROM voucher WHERE VoucherID = ?`, [voucherId]);
        return result;
    }
}
