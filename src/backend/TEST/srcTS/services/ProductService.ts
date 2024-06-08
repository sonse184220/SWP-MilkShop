import { QueryResult, RowDataPacket } from "mysql2";
import { poolConnect } from "../utils/dbConnection.js";


export class ProductService {
    // Lấy thông tin của 1 product bằng ID
    async getProduct(id: string) {
        const [product] = await poolConnect.query('SELECT * FROM product WHERE ProductID = ?', [id]);
        return product as QueryResult[];
    }

    // tìm product trong database bằng name
    async searchProducts(sname: string, slimit: number, ssortBy: string, soffset: number) {
        const search = `%${sname}%`;
        const limit =  slimit;
        const sortBy = ssortBy;
        const offset = soffset;

        // const [products] = await poolConnect.query('SELECT * FROM product WHERE Name LIKE ?', [search]);
        const [products] = await poolConnect.query(`SELECT * FROM PRODUCT WHERE Name LIKE ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`,
                                                    [search, limit, offset]
        );
        return products as QueryResult[];
    }

    // đếm số lượng product trong database bằng name
    async getTotalProductsByName(name: string) {
        const search = `%${name}%`;

        const [total]: [RowDataPacket[], any] = await poolConnect.query('SELECT COUNT(*) as count FROM PRODUCT WHERE Name LIKE ?', [search]);
        const count: number = total[0].count;

        return count;
    }

    // tìm product trong database bằng brand name
    async searchProductsByBrand(sbrand: string, slimit: number, ssortBy: string, soffset: number) {
        const brand = `%${sbrand}%`;
        const limit =  slimit;
        const sortBy = ssortBy;
        const offset = soffset;

        // const [products] = await poolConnect.query(`SELECT * FROM PRODUCT WHERE BrandID = ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`,
        //                                             [brand, limit, offset]
        // );

        const [products] = await poolConnect.query(`SELECT p.*, b.Name AS brandName 
                                                    FROM PRODUCT AS p 
                                                    JOIN brand AS b ON p.BrandID = b.BrandID 
                                                    WHERE b.Name LIKE ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`,
                                                    [brand, limit, offset]
        );

        return products as QueryResult[];
    }

    // đếm số lượng product trong database bằng brand name
    async getTotalProductsByBrand(brand: string) {
        const search = `%${brand}%`;

        const [total]: [RowDataPacket[], any] = await poolConnect.query(`SELECT COUNT(*) as count 
                                                                        FROM PRODUCT AS p 
                                                                        JOIN brand AS b ON p.BrandID = b.BrandID 
                                                                        WHERE b.Name LIKE ?`, [search]);
        const count: number = total[0].count;

        return count;
    }
}