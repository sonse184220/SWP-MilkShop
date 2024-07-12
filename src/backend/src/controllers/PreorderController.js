import { poolConnect } from "../utils/dbConnection.js";
import { PreorderService } from "../services/PreorderService.js";
import { ProductService } from "../services/ProductService.js";
import { UserService } from "../services/userService.js";
import { EmailService } from "../services/EmailService.js";

const preorderService = new PreorderService();
const productService = new ProductService();
const emailService = new EmailService();
const userService = new UserService();

export class PreorderController {

    async getPreorderHistory(req, res) {
        try {
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
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getUserPreorderHistory(req, res) {
        try {
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
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async placePreorder(req, res) {
        try {
            const userId = req.user.userId;
            const { productId, quantity, paymentMethod, name, email, phone, address } = req.body;
    
            const product = await productService.getProduct(productId);
            if (product.length === 0) {
                return res.status(400).send({ error: "Product not found!" });
            }
            if (product[0].Quantity > 0 || product[0].Status !== "available") {
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
    
            const sendingPreorderEmail = await emailService.sendPreorderConfirmationEmail(finalizePreorder.insertId, 
                                                                                        {productId, productName: product[0].Name, quantity, price: product[0].Price}, 
                                                                                        totalPrice, {name, email, phone, address});
            console.log(`Pre-order confirmation email sent: ${sendingPreorderEmail.response}`);
    
            const preorder = await preorderService.getPreorder(finalizePreorder.insertId);
            return res.status(201).send(preorder);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updatePreorderStatus(req, res) {
        try {
            const preorderId = req.params.preorderId;
            const status = req.body.status;
    
            const preorder = await preorderService.getPreorder(preorderId);
            if (preorder.length === 0) {
                return res.status(404).send({ error: "Pre-order not found!" });
            } else if (preorder[0].Status === status) {
                return res.status(200).send(preorder);
            }
    
            const updatingPreorder = await preorderService.updatePreorderStatus(preorderId, status);
            if (updatingPreorder.affectedRows === 0) {
                return res.status(500).send({ error: "Cant update pre-order status!" });
            }
    
            if (status === "Cancelled") {
                const rewardpointsDeduct = -Math.floor(preorder[0].TotalPrice * 0.02);
                const updateRewardpoints = await userService.updateUserRewardPoints(preorder[0].UserID, rewardpointsDeduct);
                if (updateRewardpoints.affectedRows === 0) {
                    return res.status(500).send({ error: "Failed to update user RewardPoints!" });
                }
            } else if (status !== "Cancelled" && preorder[0].Status === "Cancelled") {
                const rewardpointsGain = Math.floor(preorder[0].TotalPrice * 0.02);
                const updateRewardpoints = await userService.updateUserRewardPoints(preorder[0].UserID, rewardpointsGain);
                if (updateRewardpoints.affectedRows === 0) {
                    return res.status(500).send({ error: "Failed to update user RewardPoints!" });
                }
            }

            if ((status === "Shipping" || status === "Done") && preorder[0].PaymentStatus !== "Done") {
                return res.status(403).send({ msg: "This pre-order hasnt been paid yet." })
            }
    
            const updatedPreorder = await preorderService.getPreorder(preorderId);
            return res.status(200).send(updatedPreorder);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async updatePreorderStatusCancel(req, res) {
        try {
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
    
            const rewardpointsDeduct = -Math.floor(preorder[0].TotalPrice * 0.02);
            const updateRewardpoints = await userService.updateUserRewardPoints(preorder[0].UserID, rewardpointsDeduct);
            if (updateRewardpoints.affectedRows === 0) {
                return res.status(500).send({ error: "Failed to update user RewardPoints!" });
            }
            
            const updatedPreorder = await preorderService.getPreorder(preorderId);
            return res.status(200).send(updatedPreorder);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updatePreorderEta(req, res) {
        try {
            const preorderId = req.params.preorderId;
            const etaDate = req.body.eta;
    
            const preorder = await preorderService.getPreorder(preorderId);
            if (preorder.length === 0) {
                return res.status(404).send({ error: "Pre-order not found!" });
            }
    
            const updatingPreorder = await preorderService.updatePreorderEta(preorderId, etaDate);
            if (updatingPreorder.affectedRows === 0 && preorder[0].ETA === etaDate) {
                return res.status(200).send(preorder);
            } else if (updatingPreorder.affectedRows === 0) {
                return res.status(500).send({ error: "Cant update pre-order status!" });
            }
    
            const updatedPreorder = await preorderService.getPreorder(preorderId);
            return res.status(200).send(updatedPreorder);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updatePreorderPaymentStatusDone(req, res) {
        try {
            const preorderId = req.params.preorderId;

            const preorder = await preorderService.getPreorder(preorderId);
            if (preorder.length === 0) {
                return res.status(404).send({ error: "Pre-order not found!" });
            }
            if (preorder[0].PaymentMethod !== 'COD' && preorder[0].PaymentMethod !== 'Banking') {
                return res.status(409).send({ msg: "You can only use this to update payment status for COD/Banking pre-order." });
            }

            const updatingPreorder = await preorderService.updatePaymentStatusDone(preorderId);
            if (updatingPreorder.affectedRows === 0) {
                return res.status(500).send({ error: "Failed to update pre-order payment status!" });
            }

            const updatedPreorder = await preorderService.getPreorder(preorderId);
            return res.status(200).send(updatedPreorder);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}