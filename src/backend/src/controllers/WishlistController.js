import { WishlistService } from '../services/WishlistService.js';
import { ProductService } from '../services/ProductService.js';
import { MemberService } from '../services/MemberService.js';

const wishlistService = new WishlistService();
const productService = new ProductService();
const memberService = new MemberService();

export class WishlistController {

    async getWishlist(req, res) {
        const memberId = req.params.id;

        const checkMember = await memberService.getMember(memberId);
        if (checkMember.length === 0) {
            return res.status(404).send({ error: "Member not found!" });
        }

        const wistlist = await wishlistService.getWishlistByMemberID(memberId);
        return res.status(200).send(wistlist);
    }

    async addProductToWishlist(req, res) {
        const memberId = req.params.id;
        const productId = req.query.productId;

        const checkMember = await memberService.getMember(memberId);
        if (checkMember.length === 0) {
            return res.status(404).send({ error: "Member not found!" });
        }

        const checkProduct = await productService.getProduct(productId);
        if (checkProduct.length === 0) {
            return res.status(404).send({ error: "Product not found!" });
        }

        const checkExisted = await wishlistService.getWishlistRecord(memberId, productId);
        if (checkExisted.length !== 0) {
            return res.status(201).send(checkExisted);
        }

        const addingProduct = await wishlistService.addToWishlist(memberId, productId);
        if (addingProduct.affectedRows === 0) {
            return res.status(500).send({ error: "Failed to add product to wishlist!" });
        }
        
        const wishlistRecord = await wishlistService.getWishlistRecord(memberId, productId);
        return res.status(201).send(wishlistRecord);
    }

    async removeProductFromWishlist(req, res) {
        const memberId = req.params.id;
        const productId = req.query.productId;

        const checkMember = await memberService.getMember(memberId);
        if (checkMember.length === 0) {
            return res.status(404).send({ error: "Member not found!" });
        }

        const checkProduct = await productService.getProduct(productId);
        if (checkProduct.length === 0) {
            return res.status(404).send({ error: "Product not found!" });
        }

        const checkExisted = await wishlistService.getWishlistRecord(memberId, productId);
        if (checkExisted.length === 0) {
            return res.status(404).send({ error: "Product not found in this user's wishlist!" });
        }

        const removingProduct = await wishlistService.removeFromWishlist(memberId, productId);
        if (removingProduct.affectedRows === 0) {
            return res.status(500).send({ error: "Failed to remove product from wishlist!" });
        }
        
        return res.status(200).send({ msg: `Product ${productId} successfully deleted from user ${memberId}'s wishlist!` });
    }
}
