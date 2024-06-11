const productController = require('../controllers/productController');

const getAllProducts = (req, res) => {
    productController.getAllProducts((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

const getProductById = (req, res) => {
    const { id } = req.params;
    productController.getProductById(id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

module.exports = {
    getAllProducts,
    getProductById
};
