import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/HandleErrors";
import { dataService } from "../services/gladtidings";
import { logger } from "../utils/logger";
import { NetworkID } from "../utils/types/networkID";
import { FindDataRespose } from "../utils/types/gladTidingsPayload";
import crypto from "crypto"



export class DataCntroller {

    constructor() {    }

    public buyData = async( req: Request, res: Response, next: NextFunction): Promise<void> => {
        const generateIdent = async () => {
            const timestamp = Date.now();
                const random = crypto.randomBytes(4).toString('hex');
                return `Data${timestamp}${random}`;
        }
        //plan id, phone num, network, plan
        try {
            const data  = req.body;
            console.log({data})

            // const findData: FindDataRespose | any = await dataService.findData({plan_network, phone_number});

            // if (!findData) {
            //     throw new AppError("Failed to find data plan");
            // }
            const newPayload = {
                network: Number(NetworkID[data.plan_network]),
                mobile_number: data.phone_number,
                plan: data.plan_network,
                ident: await generateIdent()
            }

            // const getDataFromApi = await dataService.purchaseDataFromMErchant(newPayload);
            
            res.status(200).json({
                success: true,
                // data: ,
            });
        } catch (error: any) {
            logger.error(error.message);
            res.json(error.message).end();
            next(error)
        }
    }
}