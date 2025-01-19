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
authRouter.post('/resend-verification', authController.resendVerification);
authRouter.post('/reset-password', authController.resetPassword);
// authRouter.post('/reset-password/:token', authController.resetPassword);

export default authRouter;