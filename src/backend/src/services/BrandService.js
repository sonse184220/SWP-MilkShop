import { poolConnect } from "../utils/dbConnection.js";

export class BrandService {
    async getmaxBrandId() {
        const [brandId] = await poolConnect.query("SELECT MAX(CAST(SUBSTR(BrandID, 3) AS UNSIGNED)) AS maxId FROM brand WHERE BrandID LIKE 'BR%'");
        return brandId;
    }

    async getBrand(brandId) {
        const [brand] = await poolConnect.query("SELECT * FROM brand WHERE BrandID = ?", [brandId]);
        return brand;
    }

    async createBrand(brandId, brandName, content) {
        const [brand] = await poolConnect.query(`INSERT INTO brand (BrandID, Name, Content)
                                                 VALUES (?,?,?)`, [brandId, brandName, content]);
        return brand;
    }
}