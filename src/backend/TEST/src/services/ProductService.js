import { poolConnect } from "../utils/dbConnection.js";
export class ProductService {
    // Lấy thông tin của 1 product bằng ID
    async getProduct(id) {
        const [product] = await poolConnect.query('SELECT * FROM product WHERE ProductID = ?', [id]);
        return product;
    }
    // tìm product trong database bằng name
    async searchProducts(sname, slimit, ssortBy, soffset) {
        const search = `%${sname}%`;
        const limit = slimit;
        const sortBy = ssortBy;
        const offset = soffset;
        // const [products] = await poolConnect.query('SELECT * FROM product WHERE Name LIKE ?', [search]);
        const [products] = await poolConnect.query(`SELECT * FROM PRODUCT WHERE Name LIKE ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [search, limit, offset]);
        return products;
    }
    // đếm số lượng product trong database bằng name
    async getTotalProductsByName(name) {
        const search = `%${name}%`;
        const [total] = await poolConnect.query('SELECT COUNT(*) as count FROM PRODUCT WHERE Name LIKE ?', [search]);
        const count = total[0].count;
        return count;
    }
    // tìm product trong database bằng brand name
    async searchProductsByBrand(sbrand, slimit, ssortBy, soffset) {
        const brand = `%${sbrand}%`;
        const limit = slimit;
        const sortBy = ssortBy;
        const offset = soffset;
        // const [products] = await poolConnect.query(`SELECT * FROM PRODUCT WHERE BrandID = ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`,
        //                                             [brand, limit, offset]
        // );
        const [products] = await poolConnect.query(`SELECT p.*, b.Name AS brandName 
                                                    FROM PRODUCT AS p 
                                                    JOIN brand AS b ON p.BrandID = b.BrandID 
                                                    WHERE b.Name LIKE ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [brand, limit, offset]);
        return products;
    }
    // đếm số lượng product trong database bằng brand name
    async getTotalProductsByBrand(brand) {
        const search = `%${brand}%`;
        const [total] = await poolConnect.query(`SELECT COUNT(*) as count 
                                                                        FROM PRODUCT AS p 
                                                                        JOIN brand AS b ON p.BrandID = b.BrandID 
                                                                        WHERE b.Name LIKE ?`, [search]);
        const count = total[0].count;
        return count;
    }
}
