import { poolConnect } from "../utils/dbConnection.js";
import { PreorderService } from "../services/PreorderService.js";
import { ProductService } from "../services/ProductService.js";
import { UserService } from "../services/userService.js";

const preorderService = new PreorderService();
const productService = new ProductService();
const userService = new UserService();

export class PreorderController {

    async getPreorderHistory(req, res) {
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
        if (req.user.userId !== req.params.userId && !req.user.isAdmin && !req.user.isStaff) {
            return res.status(403).send({ msg: "Forbidden." });
        }

        const userId = req.params.userId;
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
            return res.status(403).send({ msg: "Forbidden." });
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

    async updatePreorderStatus(req, res) {
        const preorderId = req.params.preorderId;
        const status = req.body.status;

        const preorder = await preorderService.getPreorder(preorderId);
        if (preorder.length === 0) {
            return res.status(404).send({ error: "Pre-order not found!" });
        }

        const updatingPreorder = await preorderService.updatePreorderStatus(preorderId, status);
        if (updatingPreorder.affectedRows === 0 && preorder[0].Status === status) {
            return res.status(200).send(preorder);
        } else if (updatingPreorder.affectedRows === 0) {
            return res.status(500).send({ error: "Cant update pre-order status!" });
        }

        const updatedPreorder = await preorderService.getPreorder(preorderId);
        return res.status(200).send(updatedPreorder);
    }
    async updatePreorderStatusCancel(req, res) {
        const preorderId = req.params.preorderId;

        const preorder = await preorderService.getPreorder(preorderId);
        if (preorder.length === 0) {
            return res.status(404).send({ error: "Pre-order not found!" });
        }
        if (preorder[0].UserID !== req.user.userId) {
            return res.status(403).send({ msg: "Forbidden." });
        }
        if(preorder[0].Status !== 'Waiting') {
            return res.status(409).send({ msg: "You cant no longer cancel this pre-order!" });
        }

        const updatingPreorder = await preorderService.updatePreorderStatusCancel(preorderId);
        if (updatingPreorder.affectedRows === 0) {
            return res.status(500).send({ error: "Failed to update pre-order status!" });
        }

        const updatedPreorder = await preorderService.getPreorder(preorderId);
        return res.status(200).send(updatedPreorder);
    }

}