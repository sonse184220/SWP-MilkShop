import { poolConnect, connection } from "../utils/dbConnection.js";

export class BrandController {

    getAllBrands = (req, res) => {
        try {
            const query = 'SELECT * FROM BRAND';
            connection.query(query, (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(200).json(results);
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    
}
