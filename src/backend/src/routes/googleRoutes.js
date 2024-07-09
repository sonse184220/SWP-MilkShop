import express from 'express';
import passport from '../utils/passportConfig.js';
import { GoogleController } from '../controllers/googleController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();
const googleController = new GoogleController();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login-register' }),
    (req, res) => googleController.handleGoogleCallback(req, res)
);

router.post('/complete-registration', upload.single('ProfilePicture'), (req, res) => {
    googleController.completeRegistration(req, res);
});

export { router as googleRoutes };
