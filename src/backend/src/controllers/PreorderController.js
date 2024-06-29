import { poolConnect } from "../utils/dbConnection.js";
import { PreorderService } from "../services/PreorderService.js";
import { ProductService } from "../services/ProductService.js";
import { UserService } from "../services/userService.js";

const preorderService = new PreorderService();
const productService = new ProductService();
const userService = new UserService();

export class PreorderController {

    async getPreorderHistory(req, res) {
        if (req.userRole !== "admin" && req.userRole !== "staff") {
            return res.status(401).send({ msg: "Unauthorized! Only staff or admin can view all order history" });
        }

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
                sortBy = "TotalPrice ASC";
                break;
            case "highest":
                sortBy = "TotalPrice DESC";
                break;
            default:
                sortBy = "updated DESC";
        }

        const preorders = await preorderService.getAllPreorderHistory(limit, sortBy, offset);
        const total = await preorderService.getTotalPreorderNumber();

        return res.status(200).send({
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
            data: preorders,
        });
    }

    async getUserPreorderHistory(req, res) {
        if (req.user.userId !== req.params.id && req.userRole !== "admin" && req.userRole !== "staff") {
            return res.status(401).send({ msg: "Unauthorized" });
        }

        const userId = req.params.id;
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
                sortBy = "TotalPrice ASC";
                break;
            case "highest":
                sortBy = "TotalPrice DESC";
                break;
            default:
                sortBy = "updated DESC";
        }

        const preorders = await preorderService.getUserPreorderHistory(userId, limit, sortBy, offset);
        const total = await preorderService.getTotalUserPreorderNumber(userId);

        return res.status(200).send({
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
            data: preorders,
        });
    }

    async placePreorder(req, res) {
        if (req.user.userId !== req.body.userId) {
            return res.status(401).send({ msg: "Unauthorized" });
        }

        const { userId, productId, quantity, paymentMethod, name, email, phone, address } = req.body;

        const product = await productService.getProduct(productId);
        if (product.length === 0) {
            return res.status(400).send({ error: "Product not found!" });
        }
        if (product[0].Status !== "out-of-stock") {
            return res.status(400).send({ error: "Product is not eligible for pre-order!" });
        }

        const totalPrice = product[0].Price * quantity;
        const rewardpointsGain = Math.floor(totalPrice * 0.02);

        const updateRewardpoints = await userService.updateUserRewardPoints(userId, rewardpointsGain);
        if (updateRewardpoints.affectedRows === 0) {
            return res.status(500).send({ error: "Failed to update user RewardPoints!" });
        }

        const finalizePreorder = await preorderService.createPreorder(userId, productId, quantity, totalPrice, paymentMethod, name, email, phone, address);
        if (finalizePreorder.affectedRows === 0) {
            return res.status(500).send({ error: "Failed to create pre-order!" });
        }

        const preorder = await preorderService.getPreorder(finalizePreorder.insertId);
        return res.status(201).send(preorder);
    }

}