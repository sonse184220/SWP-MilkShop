const userController = require('../controllers/userController');

const getUserInfo = (req, res) => {
    const userId = req.params.userId;
    userController.getUserInfo(userId, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(results[0]);
    });
};

const updateUserInfo = (req, res) => {
    const userId = req.params.userId;
    const newUserData = req.body;
    userController.updateUserInfo(userId, newUserData, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};

const completeProfile = (req, res) => {
    userController.completeProfile(req, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};

module.exports = {
    getUserInfo,
    updateUserInfo,
    completeProfile
};
