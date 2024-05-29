const connection = require('../utils/db');

const getAllProducts = (req, res) => {
    const query = 'SELECT * FROM PRODUCT';
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

const getProductById = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM PRODUCT WHERE ProductID = ?';
    connection.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(results[0]);
    });
};

module.exports = {
    getAllProducts,
    getProductById
};
