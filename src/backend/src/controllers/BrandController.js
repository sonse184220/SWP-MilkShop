import { BrandService } from "../services/BrandService.js";
import { poolConnect, connection } from "../utils/dbConnection.js";

const brandService = new BrandService();

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

    async getBrandById(req, res) {
        const brandId = req.param.brandId;

        const brand = await brandService.getBrand(brandId);
        if (brand.length === 0) {
            return res.status(404).send({ error: "Brand not found!" })
        }

        return res.status(200).send(brand);
    }

    async createBrand(req, res) {
        const { brandName, content } = req.body;
        let nextMaxId;

        const maxBrandId = await brandService.getmaxBrandId();
        if (!maxBrandId[0].maxId) {
            nextMaxId = "BR001";
        } else {
            const nextNumericId = maxBrandId[0].maxId + 1;
            nextMaxId = `BR${nextNumericId.toString().padStart(3, '0')}`;
        }

        const creatingBrand = await brandService.createBrand(nextMaxId, brandName, content);
        if (creatingBrand.affectedRows === 0) {
            return res.status(500).send({ error: "Failed to create brand!" })
        }

        const brand = await brandService.getBrand(nextMaxId);
        return res.status(200).send(brand);
    }
    
}
