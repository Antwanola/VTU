import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/HandleErrors';
import { logger } from '../utils/logger';
import { ErrorCodes } from '../utils/errorCodes';
import { transporter, MailOptions } from '../config/nodemailer';
import { redisClient } from '../config/redis';
import { config } from 'dotenv';
import { monifyService } from '../services/payment';
import { PaymentDetails } from '../utils/types/payment';

config(); // Changed to config() as configDotenv is deprecated

const redis = redisClient;

class PaymentController {
    constructor() {}

    public initiatePayment = async ( req: Request, res: Response): Promise<void> => {
        try {
            const callInit = await monifyService.initialize()
            if (!callInit.success) {
                throw new AppError('payment not initialized')
            }
            res.send(callInit).end()
        } catch (error: any) {
            throw new AppError(error.message)
        }
    }

    public initializePayment = async (req: Request, res: Response): Promise<void> => {
        try {
            const details: PaymentDetails = {
                amount: req.body.amount,
                customerEmail: req.body.customerEmail,
                customerName: req.body.customerName, 
                paymentDescription: req.body.paymentDescription,
                paymentReference: req.body.paymentReference,
                currency: "NGN",
                redirectUrl: process.env.PAYMENT_REDIRECT_URL || "http://localhost:3000/redirect"
            };

            const payment = await monifyService.initiatePayment(details);
           res.send({result: payment})
            // if (!payment) {
            //     throw new AppError('Payment initialization failed', 400, payment);
            // }

            // res.status(200).json({
            //     success: true,
            //     data: payment
            // });

        } catch (error: any) {
            logger.error(error.message);
            res.send(error.message).end()
        }
    }
}

export const PaymentRoute = new PaymentController();