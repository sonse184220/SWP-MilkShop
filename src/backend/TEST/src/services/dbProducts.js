import { poolConnect } from "../utils/dbConnection.js";
// tìm product trong database bằng name
export async function getProducts(name) {
    const search = `%${name}%`;
    const [products] = await poolConnect.query('SELECT * FROM product WHERE Name LIKE ?', [search]);
    return products;
}
