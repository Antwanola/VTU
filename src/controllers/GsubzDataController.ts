import { logger } from "../utils/logger";
import { GsubzService } from "../services/VTU_data/gsubz";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { AppError } from "../utils/HandleErrors";
import { UserRequest } from '../utils/types/index';

class GsubsDataController {
  private gsubzService: GsubzService;
  

  constructor() {
    this.gsubzService = new GsubzService();
  }

    public generateIdent = async () => {
              const timestamp = Date.now();
                  const random = crypto.randomBytes(4).toString('hex');
                  return `Data${timestamp}${random}`;
          }
  async getDataServiceBYProvider(provider: string){
    try {
      const services = await this.gsubzService.getAllServicesBYProvider(provider);
      return services;
    } catch (error: any) {
      logger.error("Error fetching services:", error.message);
     return error.message
    }
  }


public findGsubzData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, price, networkProvider, plan, duration } = req.body;

    if (!phone || !price || !networkProvider || !plan || !duration) {
      throw new AppError("Missing required fields", 400);
    }
    const matchedData = await this.gsubzService.findOneData(networkProvider, plan, duration);
    if (!matchedData) {
      throw new AppError("No matching data found", 404);
    }

    res.status(200).json({ data: matchedData });
  } catch (error: any) {
    logger.error(error.message);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};


  public  buyGsubzData = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { price, networkProvider, plan, duration, mobile_number } = req.body;
        if ( !price || !networkProvider || !plan || !duration || !mobile_number) {
            throw new AppError("Missing required fields", 400);
        }
//Check for requested data availability
        const dataAvailable = await this.gsubzService.findOneData(networkProvider, plan, duration);
        if (dataAvailable instanceof Error) {
            logger.error(dataAvailable.message);
            throw new AppError(dataAvailable.message, 404);
        }

        const buyDataplan = await this.gsubzService.buyGsubzDataPlan({ plan, phone: mobile_number, value: dataAvailable.value });
        const transactionObject = {
                email: req.user.user.email,
                amount: price,
                transactionData: {
                    userId: req.user.user._id,
                    paymentCategory: "Data",
                    servicePaidFor: "Data Purchase",
                    amount: price,
                    paymentDescription: `Data purchase for ${mobile_number} on ${networkProvider} network`,
                    customerName: req.user.user.name,
                    transactionReference: await this.generateIdent()
                 }}
            
    } catch (error: any) {
        logger.error("Error buying Gsubz data:", error.message);
        res.status(error.statusCode).json({ error: error.message });
    }
}
}
export const gsubzDataController = new GsubsDataController();