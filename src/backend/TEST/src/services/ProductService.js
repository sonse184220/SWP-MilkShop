import { poolConnect } from "../utils/dbConnection.js";
export class ProductService {
    // tìm product trong database bằng name
    async getProducts(name) {
        const search = `%${name}%`;
        const [products] = await poolConnect.query('SELECT * FROM product WHERE Name LIKE ?', [search]);
        return products;
    }
}
