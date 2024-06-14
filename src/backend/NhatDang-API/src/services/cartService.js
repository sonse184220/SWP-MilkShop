import * as cartController from '../controllers/cartController.js';

export const addToCart = (req, res) => {
    cartController.addToCart(req.body, req.user, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};

export const removeFromCart = (req, res) => {
    cartController.removeFromCart(req.body, req.user, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};

export const updateCart = (req, res) => {
    cartController.updateCart(req.body, req.user, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};

export const viewCart = (req, res) => {
    cartController.viewCart(req.user, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};
