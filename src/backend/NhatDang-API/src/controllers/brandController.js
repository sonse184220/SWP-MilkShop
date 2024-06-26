import * as brandService from '../services/brandService.js';

export const getAllBrands = (req, res) => {
    brandService.getAllBrands((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};
