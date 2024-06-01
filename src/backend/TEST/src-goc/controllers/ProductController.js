import { poolConnect, connection } from "../utils/dbConnection.js";
import { ProductService } from "../services/ProductService.js";

export class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    async getProductById(req, res) {
        const id = req.params.id;
        const product = await this.productService.getProduct(id);
        if (product.length === 0) {
            return res.status(404).send({ error: "Product not found!" });
        }
        res.status(200).send(product);
    };
    
    async searchProducts(req, res) {
        const name = req.query.n;
        const products = await this.productService.searchProducts(name);
        if (products.length === 0) {
            return res.status(404).send({ error: "Products not found!" });
        }
        res.status(200).send(products);
    };

    getAllProducts = (req, res) => {
        const query = 'SELECT * FROM PRODUCT';
        connection.query(query, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(results);
        });
    };

}
