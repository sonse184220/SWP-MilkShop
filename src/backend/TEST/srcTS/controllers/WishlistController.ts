import { Request, Response } from 'express';
import { WishlistService } from '../services/WishlistService.js';
import { ProductService } from '../services/ProductService.js';
import { UserService } from '../services/userService.js';

export class WishlistController{
    private wishlistService: WishlistService;
    private productService: ProductService;
    private userService: UserService;

    constructor() {
        this.wishlistService = new WishlistService();
        this.productService = new ProductService();
        this.userService = new UserService();
    }

    async getWishlist(req: Request, res: Response) {
        const memberId = req.params.id;

        const checkMember = await this.userService.checkUserExisted(memberId);
        if (checkMember.length === 0) {
            return res.status(404).send({error: "Member not found!"});
        }

        const wistlist = await this.wishlistService.getWishlistByMemberID(memberId);
        return res.status(200).send(wistlist);
    }

    async addProductToWishlist(req: Request, res: Response) {
        const memberId = req.params.id;
        const productId = req.query.productId as string;

        const checkMember = await this.userService.checkUserExisted(memberId);
        if (checkMember.length === 0) {
            return res.status(404).send({error: "Member not found!"});
        }

        const checkProduct = await this.productService.getProduct(productId);
        if (checkProduct.length === 0) {
            return res.status(404).send({error: "Product not found!"});
        }

        const checkExisted = await this.wishlistService.getWishlistRecord(memberId, productId);
        if (checkExisted.length !== 0) {
            return res.status(201).send(checkExisted);
        }

        const addingProduct = await this.wishlistService.addToWishlist(memberId, productId);
        if (addingProduct.affectedRows === 0) {
            return res.status(500).send({error: "Failed to add product to wishlist!"});
        }

        const wishlistRecord = await this.wishlistService.getWishlistRecord(memberId, productId);
        return res.status(201).send(wishlistRecord);
    }

    async removeProductFromWishlist(req: Request, res: Response) {
        const memberId = req.params.id;
        const productId = req.query.productId as string;

        const checkMember = await this.userService.checkUserExisted(memberId);
        if (checkMember.length === 0) {
            return res.status(404).send({error: "Member not found!"});
        }

        const checkProduct = await this.productService.getProduct(productId);
        if (checkProduct.length === 0) {
            return res.status(404).send({error: "Product not found!"});
        }

        const checkExisted = await this.wishlistService.getWishlistRecord(memberId, productId);
        if (checkExisted.length === 0) {
            return res.status(404).send({ error: "Product not found in this user's wishlist!" });
        }

        const removingProduct = await this.wishlistService.removeFromWishlist(memberId, productId);
        if (removingProduct.affectedRows === 0) {
            return res.status(500).send({error: "Failed to remove product from wishlist!"});
        }

        return res.status(200).send({ msg: `Product ${productId} successfully deleted from user ${memberId}'s wishlist!`});
    }

}