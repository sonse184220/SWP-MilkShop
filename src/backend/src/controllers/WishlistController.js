import { WishlistService } from '../services/WishlistService.js';
import { ProductService } from '../services/ProductService.js';
import { UserService } from '../services/userService.js';

const wishlistService = new WishlistService();
const productService = new ProductService();
const userService = new UserService();

export class WishlistController {

    async getWishlist(req, res) {
        const userId = req.params.userId;

        const checkMember = userService.checkUserExisted(userId);
        if (checkMember.length === 0) {
            return res.status(404).send({ error: "Member not found!" });
        }

        const wistlist = await wishlistService.getWishlistByMemberID(userId);
        return res.status(200).send(wistlist);
    }

    async addProductToWishlist(req, res) {
        const userId = req.params.userId;
        const productId = req.query.productId;
        
        if (req.user.userId !== userId) {
            return res.status(403).send({ msg: "Forbidden." }); 
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
        const userId = req.params.userId;
        const productId = req.query.productId;

        if (req.user.userId !== userId && !req.user.isAdmin) {
            return res.status(403).send({ msg: "Forbidden." });
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
        
        return res.status(200).send({ msg: `Product ${checkProduct[0].Name} (${productId}) successfully deleted from user ${userId}'s wishlist!` });
    }
}
