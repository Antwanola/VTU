import { AppError } from "../utils/HandleErrors";
import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../utils/types/index";
// import { walletService } from "@/services/inApp_wallet";
import Wallet from "../models/wallet";
import { gSubsElectric } from "../services/Electricity/Gsubz_Electric";
import { logger } from "../utils/logger";
import { Transaction } from "../models/transactions";
import { TransactionType, TransactionStatusEnum } from "../models/transactions";
import { generateReference } from "./GsubzDataController";

class GsubzElectricityController {
  constructor() {}

  public async BuyGsubzElectric(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { provider, phone, meterNumber, amount, variation_code } = req.body;
      if (!provider || !phone || !meterNumber || !variation_code) {
        throw new AppError("one or more inputs is missing", 404);
      }
      const userID = req.user.user.id;
      const getWalletBalance = await Wallet.findOne({ user: userID });
      console.log(getWalletBalance);
      if (!getWalletBalance) {
        throw new AppError("No wallet found for user", 404);
      }
      if (getWalletBalance.balance < amount) {
        throw new AppError("Insufficient balance for purchase", 409);
      }
      const buyElectric = await gSubsElectric.BuyElectricity(
        provider,
        phone,
        meterNumber,
        amount,
        variation_code
      );
      console.log(buyElectric);
      if (buyElectric.status === "TRANSACTION_FAILED") {
        throw new AppError(
          `Unable to load electric unit due to ${buyElectric.description}`
        );
      }
      const createTransact = await Transaction.create({
        user: req.user.user.id,
        type: TransactionType.ELECTRICITY,
        amount: amount,
        status:
          buyElectric.status == "successful"
            ? TransactionStatusEnum.SUCCESS
            : TransactionStatusEnum.FAILED,
        paymentReference: await generateReference("Electricity"),
        transactionReference: buyElectric.transactionID.toString(),
        description: `Electric token purchase of ${amount} on ${buyElectric.content.serviceName} using ${phone}`,
        metaData: buyElectric,
      });
      res.status(200).json({ status: buyElectric.status, data: buyElectric });
    } catch (error: any) {
      logger.error(error.message);
      res.status(error.statusCode).json({ error: error.message });
    }
  }
}

export const gsubzElectricController = new GsubzElectricityController();
