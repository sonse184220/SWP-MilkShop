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
        return res.status(200).send(product);
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

        return res.status(200).send({
            data: products,
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
        });
    };

    async searchProductsByBrandId(req: Request, res: Response) {
        const id = req.query.id as string; 
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

        const products = await this.productService.searchProductsByBrand(id, limit, sortBy, offset);
        const total = await this.productService.getTotalProductsByBrand(id);

        return res.status(200).send({
            data: products,
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
        });
    };

    async getFeedbacks(req: Request, res: Response) {
        const productId = req.params.id;

        const feedbacks = await this.productService.getFeedbacksByProductID(productId);
        return res.status(200).send(feedbacks);
    }

    async createFeedback(req: Request, res: Response) {
        const productId = req.params.id;
        const userId = req.body.userId;
        const rating = req.body.rating;
        const content = req.body.content;

        const product = await this.productService.getProduct(productId);
        if (product.length === 0) {
            return res.status(404).send({error: "Product not found!"});
        }

        const creatingFeedback = await this.productService.createFeedback(productId, userId, rating, content);
        if (creatingFeedback.affectedRows === 0) {
            return res.status(500).send({error: "Feedback failed to create!"});
        }

        const createdFeedback = await this.productService.getFeedback(creatingFeedback.insertId);
        return res.status(201).send(createdFeedback);
    }

    async deleteFeedback(req: Request, res: Response) {
        const feedbackId = req.params.id;
        
        const checkExist = await this.productService.getFeedback(feedbackId);
        if (checkExist.length === 0) {
            return res.status(404).send({error: "Feedback not found!"});
        }

        const deletedFeedback = await this.productService.removeFeedback(feedbackId);
        if (deletedFeedback.affectedRows === 0) {
            return res.status(500).send({ msg: "Failed to delete feedback!"});
        }

        return res.status(200).send({ msg: `Feedback ${feedbackId} successfully deleted!`})
    }
}