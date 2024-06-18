import { CartService } from '../services/cartService.js';

const cartService = new CartService();

export class CartController {
    addToCart = (req, res) => {
        cartService.addToCart(req.body, req.user, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    };

    removeFromCart = (req, res) => {
        cartService.removeFromCart(req.body, req.user, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    };

    updateCart = (req, res) => {
        cartService.updateCart(req.body, req.user, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    };

    viewCart = (req, res) => {
        cartService.viewCart(req.user, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    };
}

export const cartController = new CartController();
