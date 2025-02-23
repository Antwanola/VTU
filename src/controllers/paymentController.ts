import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { AppError } from "../utils/HandleErrors";
import { logger } from "../utils/logger";
import { redisClient } from "../config/redis";
import { config } from "dotenv";
import { monifyService } from "../services/payment";
import { PaymentDetails } from "../utils/types/payment";
import { Transaction, TransactionStatus } from "../models/transactions";
import { UserRequest } from "../utils/types/index";
import { error } from "console";

config(); // Changed to config() as configDotenv is deprecated

const redis = redisClient;

class PaymentController {
  constructor() {}

  public initializePayment = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const generateReference = async () => {
      const timestamp = Date.now();
      const random = crypto.randomBytes(4).toString("hex");
      return `PAY${timestamp}${random}`;
    };
    try {
      const details: PaymentDetails = {
        amount: req.body.amount,
        customerEmail: req.body.customerEmail,
        customerName: req.body.customerName,
        paymentDescription: req.body.paymentDescription,
        paymentReference: await generateReference(),
        contractCode: req.body.contractCode,
        currencyCode: "NGN",
        redirectUrl: process.env.PAYMENT_REDIRECT_URL,
        paymentMethods: req.body.paymentMethods,
      };

      const payment = await monifyService.initiatePayment(details);
      console.log({ payment });
      if (!payment) {
        throw new AppError("Payment initialization failed");
      }
      const createTransaction = await Transaction.create({
        user: req.user.id,
        type: "data",
        amount: details.amount,
        status: TransactionStatus.PENDING,
        paymentReference: await generateReference(),
        transactionReference: payment.responseBody.transactionReference,
        metadata: {
          paymentDescription: details.paymentDescription,
          customer: details.customerName,
          paymentStatus: "PENDING",
        },
      });
      await createTransaction.save();
      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error: any) {
      logger.error(error.message);
      res.json(error.message).end();
      next(error);
    }
  };

  async verifyTransaction(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { transactionReference } = req.query;
      const reference = transactionReference.toString();
      if (transactionReference[0] !== "M") {
        throw new AppError("Invalid transaction reference");
      }
      const transaction = await monifyService.verifyPayment(reference);
      console.log({ transaction });
      if (!transaction?.requestSuccessful) {
        throw new AppError("Transaction not found", 404);
      }
      const data = transaction.responseBody;
      if (data.paymentStatus !== "PAID") {
        throw new AppError("Transaction not paid");
      }
      const updateTransaction = await Transaction.findOneAndUpdate(
        { transactionReference: data.transactionReference },
        { $set: { status: TransactionStatus.SUCCESS, metadata:{
          paymentStatus: data.paymentStatus,
          amountPaid: data.amountPaid,
          totalPayable: data.totalPayable,
          paidOn: data.paidOn,
          paymentDescription: data.paymentDescription,
          settlementAmount: data.settlementAmount,
          customer: data.customer
        } } },
        { returnDocument: "after" }
      );
      console.log({ updateTransaction });
      if (updateTransaction == null) {
        throw new AppError("Unable to update transaction");
      }
      const saved = updateTransaction.save();
      console.log({ saved });
      res.status(200).json({
        success: data.paymentStatus === "PAID",
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
      res.json({error: error.message}).end();
    }
  }
}

export const PaymentRoute = new PaymentController();
