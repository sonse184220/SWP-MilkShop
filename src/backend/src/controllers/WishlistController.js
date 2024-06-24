import { WishlistService } from '../services/WishlistService.js';
import { ProductService } from '../services/ProductService.js';
import { UserService } from '../services/userService.js';

const wishlistService = new WishlistService();
const productService = new ProductService();
const userService = new UserService();

export class WishlistController {

    async getWishlist(req, res) {
        const userId = req.params.id;

        const checkMember = userService.checkUserExisted(userId);
        if (checkMember.length === 0) {
            return res.status(404).send({ error: "Member not found!" });
        }

        const wistlist = await wishlistService.getWishlistByMemberID(userId);
        return res.status(200).send(wistlist);
    }

    async addProductToWishlist(req, res) {
        const userId = req.params.id;
        const productId = req.query.productId;

        const checkMember = await userService.checkUserExisted(userId);
        if (checkMember.length === 0) {
            return res.status(404).send({ error: "Member not found!" });
        }

        if (req.userRole !== "member" || req.user.userId !== userId) {
            return res.status(401).send({ msg: "Unauthorized!" }); 
        }

        const checkProduct = await productService.getProduct(productId);
        if (checkProduct.length === 0) {
            return res.status(404).send({ error: "Product not found!" });
        }

        const checkExisted = await wishlistService.getWishlistRecord(userId, productId);
        if (checkExisted.length !== 0) {
            return res.status(201).send(checkExisted);
        }

        const addingProduct = await wishlistService.addToWishlist(userId, productId);
        if (addingProduct.affectedRows === 0) {
            return res.status(500).send({ error: "Failed to add product to wishlist!" });
        }
        
        const wishlistRecord = await wishlistService.getWishlistRecord(userId, productId);
        return res.status(201).send(wishlistRecord);
    }

    async removeProductFromWishlist(req, res) {
        const userId = req.params.id;
        const productId = req.query.productId;

        const checkMember = await userService.checkUserExisted(userId);
        if (checkMember.length === 0) {
            return res.status(404).send({ error: "Member not found!" });
        }

        if (req.user.userId !== userId && req.userRole !== "admin") {
            return res.status(401).send({ msg: "Unauthorized!" });
        }

        const checkProduct = await productService.getProduct(productId);
        if (checkProduct.length === 0) {
            return res.status(404).send({ error: "Product not found!" });
        }

        const checkExisted = await wishlistService.getWishlistRecord(userId, productId);
        if (checkExisted.length === 0) {
            return res.status(404).send({ error: "Product not found in this user's wishlist!" });
        }

        const removingProduct = await wishlistService.removeFromWishlist(userId, productId);
        if (removingProduct.affectedRows === 0) {
            return res.status(500).send({ error: "Failed to remove product from wishlist!" });
        }
        
        return res.status(200).send({ msg: `Product ${productId} successfully deleted from user ${userId}'s wishlist!` });
    }
}
