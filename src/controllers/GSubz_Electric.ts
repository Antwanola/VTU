import { AppError } from "../utils/HandleErrors";
import { Request, Response, NextFunction } from "express";
import { UserRequest } from '../utils/types/index';
// import { walletService } from "@/services/inApp_wallet";
import Wallet from "../models/wallet";
import { gSubsElectric } from "../services/Electricity/Gsubz_Electric";



class GsubzElectricityController {
    constructor(){}

    public async BuyGsubzElectric(req: UserRequest, res: Response, next: NextFunction): Promise<void>{
        try {
            const {provider, phone, meterNumber, amount, variation_code } = req.body
            if(!provider || phone || meterNumber || variation_code){
                throw new AppError("one or more inputs missing", 404)
            }
            const userID = req.user.user.id;
            const getWalletBalance = await Wallet.findOne({user: userID})
            if(!getWalletBalance) {
                throw new AppError("No wallet found for user", 404 )
            }
            if (getWalletBalance.balance < amount ) {
                throw new AppError("Insufficient balance for purchase", 409 )
            }
            const buyElectric = await gSubsElectric.BuyElectricity(provider, phone, meterNumber, amount, variation_code)
            console.log(buyElectric)
        } catch (error) {
            
        }
    }
}

export const gsubzElectricController = new GsubzElectricityController()