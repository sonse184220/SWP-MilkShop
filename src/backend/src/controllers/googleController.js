import { GoogleService } from '../services/googleService.js';

const googleService = new GoogleService();

export const googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleCallback = passport.authenticate('google', { failureRedirect: '/login' });

export const handleGoogleCallback = (req, res) => {
    res.redirect(`/complete-profile?userId=${req.user.TempMemberID}`);
};
