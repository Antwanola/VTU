import { AppError } from "../utils/HandleErrors";
import Wallet from "../models/wallet";
import { Request, Response } from "express";
import { walletService } from "../services/inApp_wallet";
import { UserRequest } from '../utils/types/index';
import { monifyService } from "../services/payment";

class WalletController {
    constructor () {}
    
    public generateReference = async () => {
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const timestamp = Date.now().toString().slice(-6); // Get last 6 digits of timestamp	
          return `Wallet-${timestamp}-${random}`;
        };
    //create wallet at will
    public createWallet = async (req: UserRequest, res: Response): Promise<void> => {
        try {
            const walletPayload = {
                user: req.user.user._id,
                balance: 0,
                ledgerBalance: 0,
                status: "active",
                currency: "NGN",
                accountReference: await this.generateReference()

            }
            const wallet =  await Wallet.create(walletPayload)
            if (!wallet ) {
                throw new AppError("Wallet not created", 404)
            }
            res.json(wallet);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
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
    public creditWalllet = async (req: UserRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.user._id
            const { amount } = req.body;
            const paymentPayload = {
                amount,
                customerName: req.user.user.name,
                customerEmail: req.user.user.email,
                paymentReference:"",
                paymentDescription: "Wallet funding",

            }
            const monnifyPayment = await monifyService.initiatePayment(paymentPayload);
            if (monnifyPayment instanceof Error) {
                throw new AppError("Failed to initiate payment", 404);
            }
            const wallet = await walletService.creditWallet(userId, amount);
            if (wallet instanceof Error) {
                throw new AppError("Failed to credit wallet", 404);
            }
            res.json(wallet)
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    //
}


export const walletController = new WalletController();