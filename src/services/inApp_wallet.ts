import Wallet from "../models/wallet" // Assuming you have a Wallet mongoose model
import mongoose from 'mongoose';

class WalletService {
  
  // Get Wallet
  public async getWallet(email: string) {
    const wallet = await Wallet.findOne({ userEmail: email });
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    return wallet;
  }

  // Credit Wallet
  public async creditWallet(email: string, amount: number, transactionReference?: string) {
    // const session = await mongoose.startSession();
    try {
        // session.startTransaction();

        const wallet = await this.getWallet(email);
        if (!wallet) {
            throw new Error('Wallet not found');
        }

        wallet.balance += amount;           // Available immediately
        wallet.ledgerBalance += amount;     // Reflect in ledger too
        wallet.updatedAt = new Date();
        wallet.lastTransactionReference = transactionReference

        await wallet.save();     // Save within the transaction
        // await session.commitTransaction();  // Commit the transaction

        return wallet;
    } catch (error) {
        // await session.abortTransaction();   // Rollback on error
        throw error;                        // Re-throw the error
    } finally {
        // session.endSession();               // End the session
    }
  }

  // Debit Wallet
  public async debitWallet(email: string, amount: number) {
    const wallet = await this.getWallet(email);

    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    wallet.balance -= amount;           // Reduce available balance
    // Ledger balance might remain until transaction settles
    wallet.updatedAt = new Date();

    await wallet.save();
    return wallet;
  }

  // Freeze Wallet
  public async freezeWallet(email: string) {
    const wallet = await this.getWallet(email);

    wallet.status = 'suspended';
    wallet.updatedAt = new Date();

    await wallet.save();
    return wallet;
  }

  // Get Wallet Balance
  public async getWalletBalance(email: string) {
   try {
    const wallet = await this.getWallet(email);
    if(!wallet) {
      throw new Error("Wallet not found")
    }
    return {
      balance: wallet.balance,
      ledgerBalance: wallet.ledgerBalance,
      currency: wallet.currency || 'NGN',
      status: wallet.status,
    };
   } catch (error: any) {
    return error.message
   }
  }

}

export const walletService = new WalletService()
