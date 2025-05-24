import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/HandleErrors";
import { dataService } from "../services/gladtidings";
import { logger } from "../utils/logger";
import { FindDataRespose } from "../utils/types/gladTidingsPayload";
import crypto from "crypto"
import { DataRequest } from '../utils/types/index';
import { walletService } from "../services/inApp_wallet";



export class DataCntroller {

    constructor() {    }
    /**
     * This function finds the Gladtidings data plan based on the network, plan, and duration provided in the request body.
     * It uses the dataService to fetch the data plan and returns it in the response.
     * @param req : DataRequest made to accomodate data payload specifically for gladTidings data plans
     * @param res : Response from  express response
     * @param next: NextFunction to pass the control to the next middleware
     * @returns {Promise<void>} : Returns a promise that resolves to void
     */
    public findData = async (req: DataRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { network, plan, duration } = req.body;
            const findData: FindDataRespose | any = await dataService.findData(network, plan, duration);
            if (findData instanceof Error){
                logger.error(findData.message);
                throw new AppError(findData.message)
            }
            if (findData == null || Object.keys(findData).length === 0){
                logger.error("Data plan not found");
                throw new AppError("Data plan not found")
            }
            req.data = findData;
            const resposneStatus = findData ? true : false; 
            res.json({
                success: resposneStatus,
                data: req.data,
            });
        } catch (error: any) {
            logger.error({error: error.message});
            res.json({error: error.message});
        }
    }

    public buyData = async( req: DataRequest, res: Response, next: NextFunction): Promise<void> => {
        const generateIdent = async () => {
            const timestamp = Date.now();
                const random = crypto.randomBytes(4).toString('hex');
                return `Data${timestamp}${random}`;
        }
        const current_user_email = req.user.user.email;
        //bring in the data from the findData
        const findData: FindDataRespose = req.data;
        console.log({findData})
        //plan id, phone num, network, plan
        try {
            const { phone, ported}  = req.body;
            const newPayload = {
                network: Number(dataService.findNetworkPlan(findData.plan_amount)),
                mobile_number: phone,
                plan: Number(findData.dataplan_id),
                Ported_number: true,
                ident: await generateIdent()
            }

            // const getDataFromApi = await dataService.purchaseDataFromMErchant(newPayload);
            // if (getDataFromApi instanceof Error){
            //     console.log({getDataFromApi: getDataFromApi.message})
            //     throw new AppError(getDataFromApi.message)
            // }
            // const deduct_from_wallet = await walletService.debitWallet(current_user_email, amount)
            res.status(200).json({
                success: true,
                // data: getDataFromApi,
            });
        } catch (error: any) {
            logger.error(error.message);
            res.status(error.statusCode).json(error.message).end();
        }
    }
}