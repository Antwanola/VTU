import express from 'express';
import {PaymentContollers} from '../controllers/paymentController';
import { authController } from '../controllers/authController';
import { walletController } from '../controllers/WalletController';
import cors from 'cors';



const paymentRouter = express.Router();

// paymentRouter.post('/init-payment', PaymentRoute.initiatePayment)
paymentRouter.post('/make-payment',authController.authenticationToken, PaymentContollers.initializePayment)
paymentRouter.post('/verify-payment', authController.authenticationToken, PaymentContollers.verifyTransaction)
paymentRouter.post('/webhook', cors(), PaymentContollers.webHook)
paymentRouter.post('/fund-wallet',cors(), authController.authenticationToken, PaymentContollers.initializePayment)
paymentRouter.get('/wallet-balance/subscribe', authController.authenticationToken, PaymentContollers.SubscribeToWallet )



export default paymentRouter;