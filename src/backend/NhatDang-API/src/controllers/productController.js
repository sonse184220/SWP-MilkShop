import * as productService from '../services/productService.js';

export const getAllProducts = (req, res) => {
    productService.getAllProducts((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

export const getProductById = (req, res) => {
    const { id } = req.params;
    productService.getProductById(id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};
