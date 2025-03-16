import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/HandleErrors";
import { dataService } from "../services/gladtidings";
import { logger } from "../utils/logger";
import { FindDataRespose } from "../utils/types/gladTidingsPayload";
import crypto from "crypto"
import { DataRequest } from '../utils/types/index';



export class DataCntroller {

    constructor() {    }
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
        //bring in the data from the findData
        const findData: FindDataRespose = req.data;
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

            const getDataFromApi = await dataService.purchaseDataFromMErchant(newPayload);
            if (getDataFromApi instanceof Error){
                console.log({getDataFromApi: getDataFromApi.message})
                throw new AppError(getDataFromApi.message)
            }
            res.status(200).json({
                success: true,
                // data: getDataFromApi,
            });
        } catch (error: any) {
            logger.error(error.message);
            res.json(error.message).end();
            next(error)
        }
    }
}