import { logger } from "../utils/logger";
import { Data, IData } from "../models/dataPlans";
import { walletService } from "../services/inApp_wallet";
import { GsubzService } from "../services/VTU_data/gsubz";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { AppError } from "../utils/HandleErrors";
import { UserRequest } from "../utils/types/index";
import { Price } from "../models/dataPrice";
import { Transaction, TransactionType, TransactionStatusEnum } from '../models/transactions';
import { TransactionObject } from "../utils/types/gsubz_service_Enums";
import Wallet from '../models/wallet';
import { Types } from "mongoose";

class GsubsDataController {
  private gsubzService: GsubzService;

  constructor() {
    this.gsubzService = new GsubzService();
  }

  public generateIdent = async () => {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString("hex");
    return `Data${timestamp}${random}`;
  };
  // async getDataServiceBYProvider(provider: string) {
  //   try {
  //     const services = await this.gsubzService.getAllServicesBYProvider(
  //       provider
  //     );
  //     return services;
  //   } catch (error: any) {
  //     logger.error("Error fetching services:", error.message);
  //     return error.message;
  //   }
  // }

  public findGsubzData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { phone, price, network, size, duration, serviceType } = req.body;
      if (!network ) {
        throw new AppError("Missing required fields", 400);
      }
      const matchedData = await this.gsubzService.findOneData(
        serviceType,
        size,
        duration,
        network
      );
      if (!matchedData) {
        throw new AppError("No matching data found", 404);
      }

      res.status(200).json({ matchedData, serviceType });
    } catch (error: any) {
      logger.error(error.message);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

public buyGsubzData = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { price, provider, size, duration, mobile_number, serviceType } = req.body;

    if (!price || !provider || !size || !duration || !mobile_number) {
      throw new AppError("Missing required fields", 400);
    }

    // 1. Find plan
    const findData = await Data.findOne({
      networkProvider: provider,
      size: { $regex: size, $options: "i" },
      duration,
    });
    if (!findData) {
      throw new AppError("Data plan not found on server", 404);
    }

    // 2. Get wallet & check balance
    const wallet = await walletService.getWallet(req.user.user.id);
    if (!wallet || wallet.balance < findData.price!) {
      throw new AppError("Insufficient wallet balance", 400);
    }

    // 3. Check availability on gsubz
    const dataAvailable = await this.gsubzService.findOneData(
      serviceType,
      size,
      duration,
      provider
    );
    if (dataAvailable instanceof Error) {
      throw new AppError(dataAvailable.message, 404);
    }

    // 4. Buy data from gsubz
    const buyDataplan = await this.gsubzService.buyGsubzDataPlan({
      size,
      phone: mobile_number,
      value: dataAvailable.value,
      serviceType,
    });
    console.log({ buyDataplan });
    if (buyDataplan instanceof Error || buyDataplan.status === "TRANSACTION_FAILED") {
      throw new AppError(buyDataplan.message || "Transaction failed", 400);
    }

    // 5. Create transaction + debit wallet
  const transaction = await Transaction.create({
  user: req.user.user.id,
  type: TransactionType.DATA, // ✅ must match enum
  amount: findData.price,
  status: TransactionStatusEnum.SUCCESS, // ✅ not "successful"
  paymentReference: buyDataplan.transactionID,
  transactionReference: await this.generateIdent(),
  metadata: {
    userId: req.user.user._id,
    paymentCategory: "Data",
    servicePaidFor: "Data Purchase",
    amount: findData.price,
    paymentDescription: `Data purchase for ${mobile_number} on ${provider}`,
    customerName: req.user.user.name,
  },
});

    wallet.balance -= findData.price!;
    wallet.lastTransactionReference = transaction.transactionReference;
    wallet.transactions.push(transaction?._id as Types.ObjectId);
    await wallet.save();

    logger.info(`Data plan purchased successfully for ${mobile_number}`);
    res.status(200).json({
      success: true,
      message: "Data plan purchased successfully",
      data: buyDataplan,
      walletBalance: wallet.balance,
    });
  } catch (error: any) {
    logger.error(error.message);

    if (!(error instanceof AppError)) {
      return next(new AppError("Internal Server Error", 500));
    }

    res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

}
export const gsubzDataController = new GsubsDataController();
