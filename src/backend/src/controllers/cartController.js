import { CartService } from '../services/cartService.js';

const cartService = new CartService();

export class CartController {
    async addToCart(req, res) {
        try {
            const result = await cartService.addToCart(req.body, req.user);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async removeFromCart(req, res) {
        try {
            const result = await cartService.removeFromCart(req.body, req.user);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateCart(req, res) {
        try {
            const result = await cartService.updateCart(req.body, req.user);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async viewCart(req, res) {
        try {
            const result = await cartService.viewCart(req.user);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

export const cartController = new CartController();
