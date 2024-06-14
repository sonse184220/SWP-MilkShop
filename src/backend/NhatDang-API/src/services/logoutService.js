import * as logoutController from '../controllers/logoutController.js';

export const logout = (req, res) => {
    logoutController.logout(req, res);
};
