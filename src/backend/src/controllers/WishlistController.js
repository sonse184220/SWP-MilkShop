import { WishlistService } from '../services/WishlistService.js';
import { ProductService } from '../services/ProductService.js';
import { UserService } from '../services/userService.js';

const wishlistService = new WishlistService();
const productService = new ProductService();
const userService = new UserService();

export class WishlistController {

    async getWishlist(req, res) {
        try {
            const userId = req.params.userId;
    
            const checkMember = userService.checkUserExisted(userId);
            if (checkMember.length === 0) {
                return res.status(404).send({ error: "Member not found!" });
            }
    
            const wistlist = await wishlistService.getWishlistByMemberID(userId);
            return res.status(200).send(wistlist);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async addProductToWishlist(req, res) {
        try {
            const userId = req.user.userId;
            const productId = req.query.productId;
    
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
            
            return res.status(201).send({ msg: `Succesfully added product ${checkProduct[0].Name} (${checkProduct[0].ProductID}) to wishlist.` });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async removeProductFromWishlist(req, res) {
        try {
            const userId = req.user.userId;
            const productId = req.query.productId;
    
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
            
            return res.status(200).send({ msg: `Product ${checkProduct[0].Name} (${productId}) successfully removed from wishlist!` });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
