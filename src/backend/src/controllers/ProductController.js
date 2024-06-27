import { poolConnect, connection } from "../utils/dbConnection.js";
import { ProductService } from "../services/ProductService.js";

const productService = new ProductService();

export class ProductController {

    async getProductById(req, res) {
        const id = req.params.id;
        const product = await productService.getProduct(id);
        if (product.length === 0) {
            return res.status(404).send({ error: "Product not found!" });
        }
        return res.status(200).send(product);
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

        const products = await productService.searchProducts(name, limit, sortBy, offset);
        const total = await productService.getTotalProductsByName(name);
        
        return res.status(200).send({
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
            data: products,
        });
    };

    async searchProductsByBrandId(req, res) {
        const id = req.query.id;
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

        const products = await productService.searchProductsByBrand(id, limit, sortBy, offset);
        const total = await productService.getTotalProductsByBrand(id);
        
        return res.status(200).send({
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
            data: products,
        });
    };

    getAllProducts = (req, res) => {
        const query = 'SELECT * FROM PRODUCT';
        connection.query(query, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(results);
        });
    };

    async getFeedbacks(req, res) {
        const productId = req.params.id;

        const feedbacks = await productService.getFeedbacksByProductID(productId);
        return res.status(200).send(feedbacks);
    }
    
    async createFeedback(req, res) {
        const productId = req.params.id;
        const userId = req.body.userId;
        const rating = req.body.rating;
        const content = req.body.content;

        if (req.userRole !== "member" || req.user.userId !== userId) {
            return res.status(401).send({ msg: "Unauthorized!" }); 
        }

        const product = await productService.getProduct(productId);
        if (product.length === 0) {
            return res.status(404).send({ error: "Product not found!" });
        }

        const hasPurchasedProduct = await productService.checkHasUserPurchasedProduct(userId, productId);
        if (!hasPurchasedProduct[0].result) {
            return res.status(403).send({ msg: "You haven't purchased this product" });
        }

        const creatingFeedback = await productService.createFeedback(productId, userId, rating, content);
        if (creatingFeedback.affectedRows === 0) {
            return res.status(500).send({ error: "Feedback failed to create!" });
        }

        const createdFeedback = await productService.getFeedback(creatingFeedback.insertId);
        return res.status(201).send(createdFeedback);
    }

    async deleteFeedback(req, res) {
        const feedbackId = req.params.id;

        const checkExist = await productService.getFeedback(feedbackId);
        if (checkExist.length === 0) {
            return res.status(404).send({ error: "Feedback not found!" });
        }
        if (req.user.userId !== checkExist[0].UserID && req.userRole !== "admin" && req.userRole !== "staff") {
            return res.status(401).send({ msg: "Unauthorized!" });
        }

        const deletedFeedback = await productService.removeFeedback(feedbackId);
        if (deletedFeedback.affectedRows === 0) {
            return res.status(500).send({ msg: "Failed to delete feedback!" });
        }
        
        return res.status(200).send({ msg: `Feedback ${feedbackId} successfully deleted!` });
    }

}
