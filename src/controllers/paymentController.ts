import { AuthService } from "./../middleware/Auth";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { AppError } from "../utils/HandleErrors";
import { logger } from "../utils/logger";
import { config } from "dotenv";
import { monifyService } from "../services/payment";
import { PaymentDetails, TransactionResponse } from "../utils/types/payment";
import {
  Transaction,
  TransactionStatusEnum,
  TransactionType,
} from "../models/transactions";
import { UserRequest } from "../utils/types/index";
import { Data } from "../models/dataPlans";
import User from "../models/users";
import { walletService } from "../services/inApp_wallet";
import Wallet from "../models/wallet";
import { ErrorCodes } from "../utils/errorCodes";

config(); // Changed to config() as configDotenv is deprecated

class PaymentController {
  private counter;
  constructor() {
    this.counter = 0;
  }

  public initializePayment = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const generateReference = async () => {
      const timestamp = Date.now();
      this.counter++;
      return `PAY_${timestamp}-${this.counter.toString().padStart(4, "0")}`;
    };
    try {
      const {
        sku,
        paymentDescription,
        amount,
        paymentCategory,
        servicePaidFor,
      } = req.body;
      // const getAmount = await Data.find({sku});
      // if (!getAmount){
      //   throw new AppError("Product not identified. Please provide producnt Sku number")
      // }
      console.log(req.user.user.id);
      const details: PaymentDetails = {
        amount: amount,
        paymentCategory: paymentCategory,
        customerEmail: req.user.user.email,
        customerName: `${req.user.user.firstName} ${req.user.user.lastName}`,
        paymentDescription: paymentDescription,
        paymentReference: await generateReference(),
        contractCode: process.env.MONNIFY_CONTRACT_CODE,
        currencyCode: "NGN",
        redirectUrl: process.env.PAYMENT_REDIRECT_URL,
        paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
        metaData: {
          servicePaidFor: req.body.servicePaidFor,
        },
      };

      const payment = await monifyService.initiatePayment(details);
      if (!payment) {
        throw new AppError(
          "Payment initialization failed",
          400,
          ErrorCodes.PAY__001
        );
      }
      const createTransaction = await Transaction.create({
        user: req.user.user.id,
        paymentCategory,
        type: req.body.servicePaidFor,
        amount: details.amount,
        status: TransactionStatusEnum.PENDING,
        paymentReference: await generateReference(),
        transactionReference: payment.responseBody.transactionReference,
        metadata: {
          paymentDescription: details.paymentDescription,
          customer: details.customerName,
          paymentStatus: TransactionStatusEnum.PENDING,
        },
      });
      const saved = await createTransaction.save();
      console.log(req.user.user.id);

      const update_user = await User.findByIdAndUpdate(req.user.user.id, {
        $push: { transactions: saved._id },
      });

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error: any) {
      logger.error({ error: error.message });
      res.status(error.statusCode).json(error.mesage);
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
      if (!transaction || !transaction.requestSuccessful) {
        throw new AppError("Transaction not found", 404);
      }
      const data = transaction.responseBody;
      if (data.paymentStatus !== "PAID") {
        throw new AppError("Transaction not paid");
      }
      const updateTransaction = await Transaction.findOneAndUpdate(
        { transactionReference: data.transactionReference },
        {
          $set: {
            status: TransactionStatusEnum.SUCCESS,
            metadata: {
              paymentStatus: data.paymentStatus,
              amountPaid: data.amountPaid,
              totalPayable: data.totalPayable,
              paidOn: data.paidOn,
              paymentDescription: data.paymentDescription,
              settlementAmount: data.settlementAmount,
              customer: data.customer,
            },
          },
        },
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
      res.json({ error: error.message }).end();
    }
  }

  public async webHook(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const signature = req.headers["monnify-signature"] as string;

      // Validate the webhook payload and signature
      const data = await monifyService.webhookHandler(payload, signature);
      if (!data) {
        throw new AppError("Webhook verification failed", 401);
      }

      if (data.paymentStatus !== "PAID") {
        throw new AppError("Transaction not paid", 400);
      }

      // Update the transaction in the database

      console.log({ checking: Number(data.amountPaid) - 50 });
      const updateTransaction = await Transaction.findOneAndUpdate(
        { transactionReference: data.transactionReference },
        {
          $set: {
            status: TransactionStatusEnum.SUCCESS,
            type: data.servicePaymentType,
            userEmail: data.customer.email,
            transactionReference: data.transactionReference,
            paymentReference: data.reference,
            amount: data.amountPaid,
            metadata: {
              paymentStatus: data.paymentStatus,
              amountPaid: data.amountPaid,
              settlementAmount_inApp: Number(data.amountPaid) - 50, // General deducted fee by the app
              amountDeducted: 50, // General deducted fee by the app
              totalPayable: data.totalPayable,
              paidOn: data.paidOn,
              paymentDescription: data.paymentDescription,
              settlementAmount: data.settlementAmount,
              customer: data.customer,
            },
          },
        },
        { returnDocument: "after" }
      );

      if (!updateTransaction) {
        throw new AppError("Unable to update transaction", 404);
      }

      // Fund user wallet if service is "fund_wallet"
      console.log("data:", data);
      if (data.servicePaymentType === "fund_wallet") {
        if (!data.customer?.email) {
          throw new AppError("Customer email missing", 400);
        }

        //get wallet and verify transaction reference to curb double payment on a single transaction
        const userWallet = await Wallet.findOne({
          userEmail: data.customer.email,
        });
        if (!userWallet) {
          throw new AppError("User wallet not found", 404);
        }
        if (userWallet.lastTransactionReference == data.transactionReference) {
          throw new AppError("Transaction already processed", 400);
        }
        const update_user_wallet = await walletService.creditWallet(
          data.customer.email,
          updateTransaction.metadata.settlementAmount_inApp,
          data.transactionReference
        );
        if (update_user_wallet instanceof Error) {
          throw new AppError("Failed to credit wallet", 404);
        }
      }
      res.status(200).json({
        success: true,
        message: "Webhook processed successfully",
      });
    } catch (error: any) {
      logger.error(error.message);

      if (error instanceof AppError) {
        res.status(error.statusCode || 400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
}

export const PaymentContollers = new PaymentController();
