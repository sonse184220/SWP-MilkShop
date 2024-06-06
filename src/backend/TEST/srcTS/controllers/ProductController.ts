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
        const name = req.query.name as string; 
        const limit = parseInt(req.query.limit as string);
        const page = parseInt(req.query.page as string);
        const sort = req.query.sort as string;
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

    async searchProductsByBrand(req: Request, res: Response) {
        const brand = req.query.brand as string; 
        const limit = parseInt(req.query.limit as string);
        const page = parseInt(req.query.page as string);
        const sort = req.query.sort as string;
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

        const products = await this.productService.searchProductsByBrand(brand, limit, sortBy, offset);
        const total = await this.productService.getTotalProductsByBrand(brand);

        res.status(200).send({
            data: products,
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
        });
    };
}