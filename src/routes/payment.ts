import express from 'express';
import {PaymentContollers} from '../controllers/paymentController';
import { authController } from '../controllers/authController';
import { walletController } from '../controllers/WalletController';



const paymentRouter = express.Router();

// paymentRouter.post('/init-payment', PaymentRoute.initiatePayment)
paymentRouter.post('/make-payment',authController.authenticationToken, PaymentContollers.initializePayment)
paymentRouter.post('/verify-payment', authController.authenticationToken, PaymentContollers.verifyTransaction)
paymentRouter.post('/webhook', PaymentContollers.webHook)
paymentRouter.post('/fund-wallet', authController.authenticationToken, walletController.creditWalllet)



export default paymentRouter;