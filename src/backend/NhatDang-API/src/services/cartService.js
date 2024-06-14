const cartController = require('../controllers/cartController');

const addToCart = (req, res) => {
    const user = req.user;
    cartController.addToCart(req.body, user, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Product added to cart' });
    });
};

const viewCart = (req, res) => {
    const user = req.user;
    const guestId = req.session.guestId || null;
    cartController.viewCart(user, guestId, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};


module.exports = {
    addToCart,
    viewCart,
};
