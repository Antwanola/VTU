import { AppError } from "../utils/HandleErrors";
import Wallet, { IWallet, IWalletDocument } from "../models/wallet";
import { Request, Response } from "express";
import { walletService } from "../services/inApp_wallet";
import { UserRequest } from '../utils/types/index';
import { monifyService } from "../services/payment";
import User from "../models/users";

class WalletController {
    constructor () {}
    
    public generateReference = async () => {
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const timestamp = Date.now().toString().slice(-6); // Get last 6 digits of timestamp	
          return `Wallet-${timestamp}-${random}`;
        };
    //create wallet at will
    public createWallet = async (userID: string): Promise<IWallet | Error> => {
        try {
            const walletPayload = {
                user: userID,
                balance: 0,
                status: "active",
                currency: "NGN",
                accountReference: await this.generateReference()

            }
            const wallet =  await Wallet.create(walletPayload)
            if (!wallet ) {
                throw new AppError("Wallet not created", 404)
            }
            console.log({walletCreation: wallet})
            return wallet
        } catch (error: any) {
            return error.message as Error
        }
    };
    //get wallet by userId
    public getWallet = async (req: UserRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.user._id
            const wallet = await walletService.getWallet(userId);
            if (wallet instanceof Error) {
                throw new AppError("Failed to retrieve wallet for the given user ID", 404);
            }
            res.json(wallet)
        }
        catch(error: any) {
            res.json(error.message)
        }
    }
/**
 * Creadit wallet used to fund user wallet when user is signed in.
 * @param req The Custom user request objectcontaining user information extending request data
 * @param res Express response object
 * @return {Promise<void>} A promise that resolves to void
 * @throws {AppError} If there is an error during the process, an AppError is thrown with a message and status code.
 */
    public FundWallet = async (req: UserRequest, res: Response): Promise<void> => {
        let user = null;
        let createWall: IWallet | Error;
        try {
            const userId = req.user.user.id
            console.log(userId)
            const { amount } = req.body;
            const paymentPayload = {
                amount,
                customerName: req.user.user.name,
                customerEmail: req.user.user.email,
                paymentReference:"",
                paymentDescription: "Wallet funding",

            }
            const getUserWallet = await User.findOne({userId}).populate('wallet');
            console.log({getUserWallet})
            if(userId && !getUserWallet){
                createWall = await this.createWallet(userId)
                if (createWall instanceof Error){
                    console.log({createWall})
                    throw new AppError(createWall.message || "Unable to create wallet for user", 402)
                }

                user = await User.findOne({userId});
                if(user){
                    user.wallet = createWall?._id
                    user.save()
                }
            }

            res.status(200).json({
                success: true,
                data: "testing",
                message: "Payment initiated successfully, please complete the payment to fund your wallet"
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    //
}


export const walletController = new WalletController();