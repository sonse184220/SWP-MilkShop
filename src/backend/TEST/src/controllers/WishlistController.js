import { WishlistService } from '../services/WishlistService.js';
import { ProductService } from '../services/ProductService.js';
import { MemberService } from '../services/MemberService.js';
export class WishlistController {
    constructor() {
        this.wishlistService = new WishlistService();
        this.productService = new ProductService();
        this.memberService = new MemberService();
    }
    async getWishlist(req, res) {
        const memberId = req.params.id;
        const checkMember = await this.memberService.getMember(memberId);
        if (checkMember.length === 0) {
            return res.status(404).send({ error: "Member not found!" });
        }
        const wistlist = await this.wishlistService.getWishlistByMemberID(memberId);
        return res.status(200).send(wistlist);
    }
    async addProductToWishlist(req, res) {
        const memberId = req.params.id;
        const productId = req.query.productId;
        const checkMember = await this.memberService.getMember(memberId);
        if (checkMember.length === 0) {
            return res.status(404).send({ error: "Member not found!" });
        }
        const checkProduct = await this.productService.getProduct(productId);
        if (checkProduct.length === 0) {
            return res.status(404).send({ error: "Product not found!" });
        }
        const checkExisted = await this.wishlistService.getWishlistRecord(memberId, productId);
        if (checkExisted.length !== 0) {
            return res.status(201).send(checkExisted);
        }
        const addingProduct = await this.wishlistService.addToWishlist(memberId, productId);
        if (addingProduct.affectedRows === 0) {
            return res.status(500).send({ error: "Failed to add product to wishlist!" });
        }
        const wishlistRecord = await this.wishlistService.getWishlistRecord(memberId, productId);
        return res.status(201).send(wishlistRecord);
    }
}
