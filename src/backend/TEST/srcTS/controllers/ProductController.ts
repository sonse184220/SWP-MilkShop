import { Request, Response } from 'express';
import { ProductService } from "../services/ProductService.js";

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }


    async getProductById(req: Request, res: Response) {
        const id = req.params.id;
    
        const product = await this.productService.getProduct(id);
        if (product.length === 0) {
            return res.status(404).send({error: "Product not found!"});
        }
        res.status(200).send(product);
    };

    async searchProducts(req: Request, res: Response) {
        const name = req.query.n as string;
    
        const products = await this.productService.searchProducts(name);
        if (products.length === 0) {
            return res.status(404).send({error: "Products not found!"});
        }
        res.status(200).send(products);
    };
}