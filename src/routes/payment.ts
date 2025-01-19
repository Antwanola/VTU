import express from 'express';
import {PaymentRoute} from '../controllers/paymentController';
import { monifyService } from '../services/payment';
import { authController } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { limiter } from '../middleware/rateLimiter';


const paymentRouter = express.Router();

paymentRouter.post('/init-payment', PaymentRoute.initiatePayment)
paymentRouter.post('/make-payment', PaymentRoute.initializePayment)


export default paymentRouter;