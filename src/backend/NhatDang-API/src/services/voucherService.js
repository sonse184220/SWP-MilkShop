import * as voucherController from '../controllers/voucherController.js';

export const getAllVouchers = (req, res) => {
    voucherController.getAllVouchers((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};
