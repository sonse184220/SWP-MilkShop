const connection = require('../utils/db');

const getAllBrands = (req, res) => {
    const query = 'SELECT * FROM BRAND';
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

module.exports = {
    getAllBrands
};
