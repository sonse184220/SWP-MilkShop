import { poolConnect, connection } from "../utils/dbConnection.js";
import { ProductService } from "../services/ProductService.js";
import sharp from 'sharp';
import { UserService } from "../services/userService.js";

const productService = new ProductService();
const userService = new UserService();

export class ProductController {

    async getProductById(req, res) {
        try {
            const id = req.params.id;

            const product = await productService.getProduct(id);
            if (product.length === 0) {
                return res.status(404).send({ error: "Product not found!" });
            }

            const feedbacks = await productService.getFeedbacksByProductID(id)

            return res.status(200).send({
                product: product[0],
                feedbacks: feedbacks
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    async searchProducts(req, res) {
        try {
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
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    async searchProductsByBrandId(req, res) {
        try {
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
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getAllProducts = async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        try {
            const products = await productService.getAllProducts(page, limit);
            const totalProducts = await productService.getTotalProducts();
            const totalPages = Math.ceil(totalProducts / limit);

            res.status(200).json({
                products,
                totalProducts,
                totalPages,
                currentPage: page
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    getAvailableProducts = async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        try {
            const products = await productService.getAvailableProducts(page, limit);
            const totalProducts = await productService.getTotalAvaialbleProducts();
            const totalPages = Math.ceil(totalProducts / limit);

            res.status(200).json({
                products,
                totalProducts,
                totalPages,
                currentPage: page
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    async createFeedback(req, res) {
        try {
            const productId = req.params.id;
            const userId = req.user.userId;
            const rating = req.body.rating;
            const content = req.body.content;

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
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async searchFeedbacks(req, res) {
        try {
            const { content, fuid, fpid, filter, sort } = req.query;
            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
            const offset = (page - 1) * limit;

            let filterField = "";
            let valueField = [];

            switch (filter) {
                case "user":
                    const checkUser = await userService.checkUserExisted(fuid);
                    if (checkUser.length === 0) {
                        return res.status(404).send({ error: "User not found!" })
                    }

                    filterField = "AND f.UserID = ?";
                    valueField = [fuid];
                    break;
                case "product":
                    const checkProduct = await productService.getProduct(fpid);
                    if (checkProduct.length === 0) {
                        return res.status(404).send({ error: "Product not found!" });
                    }

                    filterField = "AND f.ProductID = ?"
                    valueField = [fpid];
                    break;
                case "user&product":
                    const checkUserAndProduct = await Promise.all([userService.checkUserExisted(fuid), productService.getProduct(fpid)]);
                    if (checkUserAndProduct[0].length === 0) {
                        return res.status(404).send({ error: "User not found!" })
                    }
                    if (checkUserAndProduct[1].length === 0) {
                        return res.status(404).send({ error: "Product not found!" });
                    }

                    filterField = "AND f.UserID = ? AND f.ProductID = ?"
                    valueField = [fuid, fpid]
                    break;
                default:
                // nothing
            }

            let sortBy;
            switch (sort) {
                case "newest":
                    sortBy = "created DESC";
                    break;
                case "oldest":
                    sortBy = "created ASC";
                    break;
                case "lowest":
                    sortBy = "Rating ASC";
                    break;
                case "highest":
                    sortBy = "Rating DESC";
                    break;
                default:
                    sortBy = "created DESC";
            }

            const feedbacks = await productService.searchFeedbacks(content, filterField, valueField, limit, sortBy, offset);
            const total = await productService.getTotalSearchFeedbacks(content, filterField, valueField)

            return res.status(200).send({
                total: total,
                page: page,
                totalPages: Math.ceil(total / limit),
                data: feedbacks,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async deleteFeedback(req, res) {
        try {
            const feedbackId = req.params.id;

            const checkExist = await productService.getFeedback(feedbackId);
            if (checkExist.length === 0) {
                return res.status(404).send({ error: "Feedback not found!" });
            }
            if (req.user.userId !== checkExist[0].UserID && !req.user.isAdmin && !req.user.isStaff) {
                return res.status(403).send({ msg: "Forbidden." });
            }

            const deletedFeedback = await productService.removeFeedback(feedbackId);
            if (deletedFeedback.affectedRows === 0) {
                return res.status(500).send({ msg: "Failed to delete feedback!" });
            }

            return res.status(200).send({ msg: `Feedback ${feedbackId} successfully deleted!` });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createProduct(req, res) {
        try {
            const { file } = req;
            const result = await productService.createProduct(req.body, file.buffer);
            res.status(201).json(result);
        } catch (error) {
            console.error("Error creating product:", error);
            res.status(500).json({ error: error.message || "Error creating product" });
        }
    }

    async updateProduct(req, res) {
        try {
            const { file } = req;
            const productId = req.params.id;
            const result = await productService.updateProduct(productId, req.body, file ? file.buffer : null);

            res.status(200).json(result);
        } catch (error) {
            console.error("Error updating product:", error);
            res.status(500).json({ error: error.message || "Error updating product" });
        }
    }

    async getLatestProducts(req, res) {
        try {
            const products = await productService.getLatestProducts();
            return res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getBestSellingProducts(req, res) {
        try {
            const products = await productService.getBestSellingProducts();
            return res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
