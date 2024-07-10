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

    async getAllVoucher(req, res) {
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const sort = req.query.sort;
        const offset = (page - 1) * limit;

        let sortBy;
        switch (sort) {
            case "newest":
                sortBy = "Expiration DESC";
                break;
            case "oldest":
                sortBy = "Expiration ASC";
                break;
            case "lowest":
                sortBy = "VoucherQuantity ASC";
                break;
            case "highest":
                sortBy = "VoucherQuantity DESC";
                break;
            default:
                sortBy = "Expiration DESC";
        }

        const vouchers = await voucherService.getAllVouchers(limit, sortBy, offset);
        const total = await voucherService.getTotalVoucher();

        return res.status(200).send({
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
            data: vouchers,
        });
    }

    async createVoucher(req, res) {
        const { discount, quantity, expiration, content } = req.body;

        const creatingVoucher = await voucherService.createVoucher(discount, quantity, expiration, content);
        if (creatingVoucher.affectedRows === 0) {
            return res.status(500).send({ error: "Cant create voucher!" })
        }

        const createdVoucher = await voucherService.getVoucher(creatingVoucher.insertId);
        return res.status(201).send(createdVoucher);
    }

    async updateVoucher(req, res) {
        const voucherId = req.params.voucherId;
        const { quantity, expiration, content } = req.body;

        const checkVoucher = await voucherService.getVoucher(voucherId);
        if (checkVoucher.length === 0) {
            return res.status(404).send({ error: "Voucher not found!" })
        }

        const queryField = [];
        const valueField = [];

        if (quantity && quantity !== checkVoucher[0].VoucherQuantity) {
            queryField.push("VoucherQuantity = ?")
            valueField.push(quantity)
        }
        if (expiration && expiration !== checkVoucher[0].Expiration) {
            queryField.push("Expiration = ?")
            valueField.push(expiration)
        }
        if (content && content !== checkVoucher[0].Content) {
            queryField.push("Content = ?")
            valueField.push(content)
        }

        if (queryField.length === 0) {
            return res.status(200).send(checkVoucher);
        }

        const updatingVoucher = await voucherService.updateVoucher(voucherId, queryField, valueField);
        if (updatingVoucher.affectedRows === 0) {
            return res.status(500).send({ msg: "Cant update voucher!" })
        }
        const updatedVoucher = await voucherService.getVoucher(voucherId);

        return res.status(200).send(updatedVoucher);
    }

    async deleteVoucher(req, res) {
        const voucherId = req.params.voucherId;

        const checkVoucher = await voucherService.getVoucher(voucherId);
        if (checkVoucher.length === 0) {
            return res.status(404).send({ error: "Voucher not found!" })
        }

        const deletingVoucher = await voucherService.deleteVoucher(voucherId);
        if (deletingVoucher.affectedRows === 0) {
            return res.status(500).send({ error: `Failed to delete voucher!` })
        }

        return res.status(200).send({ msg: `Successfully delete voucher (ID: ${voucherId})` });
    }
}
