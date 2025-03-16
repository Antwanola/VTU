import express from 'express';
import {PaymentRoute} from '../controllers/paymentController';
import { authController } from '../controllers/authController';



const paymentRouter = express.Router();

// paymentRouter.post('/init-payment', PaymentRoute.initiatePayment)
paymentRouter.post('/make-payment',authController.authenticationToken, PaymentRoute.initializePayment)
paymentRouter.post('/verify-payment', authController.authenticationToken, PaymentRoute.verifyTransaction)
// paymentRouter.get('/verify-payment-response', authController.authenticationToken, PaymentRoute.verifyTransaction)


export default paymentRouter;