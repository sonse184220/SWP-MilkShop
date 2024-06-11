const brandController = require('../controllers/brandController');

const getAllBrands = (req, res) => {
    brandController.getAllBrands((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

module.exports = {
    getAllBrands
};
