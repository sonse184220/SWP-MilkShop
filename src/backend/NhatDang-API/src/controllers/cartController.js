import * as cartService from '../services/cartService.js';

export const addToCart = (req, res) => {
    cartService.addToCart(req.body, req.user, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};

export const removeFromCart = (req, res) => {
    cartService.removeFromCart(req.body, req.user, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};

export const updateCart = (req, res) => {
    cartService.updateCart(req.body, req.user, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};

export const viewCart = (req, res) => {
    cartService.viewCart(req.user, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};
