import { check } from "express-validator";
import { BrandService } from "../services/BrandService.js";
import { poolConnect, connection } from "../utils/dbConnection.js";

const brandService = new BrandService();

export class BrandController {

    async getAllBrands(req, res) {
        try {
            const brands = await brandService.getAllBrands();
            res.status(200).json(brands);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getBrandById(req, res) {
        try {
            const brandId = req.param.brandId;

            const brand = await brandService.getBrand(brandId);
            if (brand.length === 0) {
                return res.status(404).send({ error: "Brand not found!" })
            }

            return res.status(200).send(brand);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createBrand(req, res) {
        try {
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
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async deleteBrand(req, res) {
        try {
            const brandId = req.param.brandId;

            const checkBrand = await brandService.getBrand(brandId);
            if (checkBrand.length === 0) {
                return res.status(404).send({ error: "Brand not found!" })
            }

            const deletingBrand = await brandService.deleteBrand(brandId);
            if (deletingBrand.affectedRows === 0) {
                return res.status(500).send({ error: "Cant delete brand!" })
            }

            return res.status(200).send({ msg: `Successfully delete brand ${checkBrand[0].Name} (${brandId}).` })
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateBrand(req, res) {
        try {
            const brandId = req.param.brandId;
            const { brandName, content } = req.body;

            const checkBrand = await brandService.getBrand(brandId);
            if (checkBrand.length === 0) {
                return res.status(404).send({ error: "Brand not found!" })
            }

            const queryField = [];
            const valueField = [];

            if (brandName && brandName !== checkBrand[0].Name) {
                queryField.push("Name = ?")
                valueField.push(brandName)
            }
            if (content && content !== checkBrand[0].Content) {
                queryField.push("Content = ?")
                valueField.push(content)
            }

            if (queryField.length === 0) {
                return res.status(200).send(checkBrand);
            }

            const updatingBrand = await brandService.updateBrand(brandId, queryField, valueField);
            if (updatingBrand.affectedRows === 0) {
                return res.status(500).send({ error: "Cant update brand!" })
            }
            const updatedBrand = await brandService.getBrand(brandId);

            return res.status(200).send(updatedBrand);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

}
