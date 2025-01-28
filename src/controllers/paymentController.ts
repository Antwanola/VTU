import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/HandleErrors";
import { logger } from "../utils/logger";
import { ErrorCodes } from "../utils/errorCodes";
import { transporter, MailOptions } from "../config/nodemailer";
import { redisClient } from "../config/redis";
import { config } from "dotenv";
import { monifyService } from "../services/payment";
import { PaymentDetails } from "../utils/types/payment";

config(); // Changed to config() as configDotenv is deprecated

const redis = redisClient;

class PaymentController {
  constructor() {}

  public initiatePayment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const callInit = await monifyService.initialize();
      // if (!callInit?.success) {
      //     throw new AppError('payment not initialized')
      // }
      res.send(callInit).end();
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  public initializePayment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const details: PaymentDetails = {
        amount: req.body.amount,
        customerEmail: req.body.customerEmail,
        customerName: req.body.customerName,
        paymentDescription: req.body.paymentDescription,
        paymentReference: req.body.paymentReference,
        contractCode: req.body.contractCode,
        currencyCode: "NGN",
        redirectUrl: process.env.PAYMENT_REDIRECT_URL,
        paymentMethods: req.body.paymentMethods,
      };

      const payment = await monifyService.initiatePayment(details);
      if (!payment) {
        throw new AppError("Payment initialization failed");
      }

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error: any) {
      logger.error(error.message);
      res.send(error.message).end();
    }
  };

  async verifyTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { transactionReference } = req.query;
      if (!transactionReference) {
        throw new AppError("Reference is required");
      }
      const transaction = await monifyService.verifyPayment(
        transactionReference as string
      );
      if (!transaction?.requestSuccessful) {
        throw new AppError("Transaction not found", 404);
      }
      const data = transaction.responseBody;
      if (data.paymentStatus !== "PAID") {
        throw new AppError("Transaction not paid");
      }
      res.status(200).json({
        success: true,
        data: {
          amountPaid: data.amountPaid,
          totalPayable: data.totalPayable,
          paymentStatus: data.paymentStatus,
          paidOn: data.paidOn,
          paymentDescription: data.paymentDescription,
          settlementAmount: data.settlementAmount,
          customer: data.customer,

        },
      });
    } catch (error: any) {
      logger.error(error.message);
      throw new AppError(error.message, 404);
    }
  }
}

export const PaymentRoute = new PaymentController();
