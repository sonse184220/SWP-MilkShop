import express from 'express';
import passport from '../utils/googlePassport.js';
import { googleController } from '../controllers/googleController.js';

const router = express.Router();

router.get('/google-login', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), googleController.googleAuthCallback);
router.post('/complete-profile', googleController.completeProfile);

export { router as googleRoutes };


//Bật trình duyệt lên vào localhost:4500/api/google/google-login trước, sau đó đăng nhập vào bằng tài khoản google  và cấp quyền (EMAIL NÀY VẪN TÍNH LÀ UNIQUE KEY NÊN ĐỪNG ĐĂNG NHẬP BẰNG TÀI KHOẢN ĐÃ ĐĂNG KÍ TRONG DATABASE).
//Google sẽ redirect tới /google/callback, và response ra 1 json có đựng jwt token ở trong.
//Lên Postman vào phần complete profile, bỏ jwt token đó vào header xong test.