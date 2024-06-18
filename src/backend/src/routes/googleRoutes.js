import express from 'express';
import passport from 'passport';
import { googleLogin, googleCallback, handleGoogleCallback } from '../controllers/googleController.js';

const router = express.Router();

router.get('/google', googleLogin);
router.get('/google/callback', googleCallback, handleGoogleCallback);

export { router as googleRoutes };
