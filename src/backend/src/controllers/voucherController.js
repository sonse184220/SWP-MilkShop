import { VoucherService } from '../services/voucherService.js';

const voucherService = new VoucherService();

export class VoucherController {
    getAvailableVouchers = (req, res) => {
        voucherService.getAvailableVouchers((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(results);
        });
    };

    useVoucher = (req, res) => {
        const { voucherId } = req.body;
        voucherService.useVoucher(voucherId, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Voucher used successfully' });
        });
    };
}
