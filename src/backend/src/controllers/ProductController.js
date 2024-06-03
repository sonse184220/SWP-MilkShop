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
        const name = req.query.name;
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const sort = req.query.sort;
        const offset = (page - 1) * limit;

        let sortBy;
        switch (sort) {
            case "newest":
                sortBy = "updated DESC";
                break;
            case "oldest":
                sortBy = "updated ASC";
                break;
            case "lowest":
                sortBy = "Price ASC";
                break;
            case "highest":
                sortBy = "Price DESC";
                break;
            default:
                sortBy = "updated DESC";
        }

        const products = await this.productService.searchProducts(name, limit, sortBy, offset);
        const total = await this.productService.getTotalProductsByName(name);
        
        res.status(200).send({
            data: products,
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
        });
    };

    getAllProducts = (req, res) => {
        const query = 'SELECT * FROM PRODUCT';
        connection.query(query, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(results);
        });
    };

}
