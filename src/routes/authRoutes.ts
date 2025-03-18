import express from 'express';
import { authController } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { limiter } from '../middleware/rateLimiter';

const authRouter = express.Router();

// Apply rate limiting to auth routes
authRouter.use(limiter);

authRouter.post('/register', validateRequest, authController.register );
authRouter.post('/login', validateRequest, authController.login);
authRouter.post('/verify-email', authController.verifyEmail);
authRouter.post('/verify-account', authController.verifyAccount);
authRouter.post('/send-verification-email', authController.sendVerification);
authRouter.post('/reset-password', authController.authenticationToken, authController.changePassword);
// authRouter.post('/change-pin',authController.authenticationToken, authController.changePin )
authRouter.get('/get-profile', authController.authenticationToken, authController.getUserProfile);
authRouter.get('/forgot-password-request', authController.resetPasswordRequest)
authRouter.post('/forgot-password',  authController.forgotPassword);
authRouter.get('/get-users', authController.getUsers)

// authRouter.post('/reset-password/:token', authController.resetPassword);

export default authRouter;