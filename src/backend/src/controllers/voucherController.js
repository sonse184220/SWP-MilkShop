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

    async createVoucher(req, res) {
        const { discount, quantity, expiration, content } = req.body;

        const creatingVoucher = await voucherService.createVoucher(discount, quantity, expiration, content);
        if (creatingVoucher.affectedRows === 0) {
            return res.status(500).send({ error: "Cant create voucher!" })
        }

        const createdVoucher = await voucherService.getVoucher(creatingVoucher.insertId);
        return res.status(201).send(createdVoucher);
    }
}
