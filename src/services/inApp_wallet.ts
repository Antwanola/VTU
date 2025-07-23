import { AppError } from "../utils/HandleErrors";
import Wallet, { IWallet } from "../models/wallet" // Assuming you have a Wallet mongoose model
import { Transaction, TransactionStatusEnum } from "../models/transactions";
import { PaymentContollers } from "../controllers/paymentController";

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
public async debitWallet(
  email: string,
  amount: number,
  transactionData: {
    userId: string;
    paymentCategory: string;
    servicePaidFor: string;
    amount: number;
    paymentDescription: string;
    customerName: string;
    transactionReference: string;
  }
): Promise<IWallet> {
  const wallet = await this.getWallet(email);

  if (!wallet) {
    throw new Error("Couldn't get user wallet");
  }

  if (wallet.balance < amount) {
    throw new Error('Insufficient balance');
  }

  wallet.balance -= amount;
  wallet.updatedAt = new Date();
  await wallet.save();

  const transaction = await Transaction.create({
    user: transactionData.userId,
    paymentCategory: transactionData.paymentCategory,
    type: transactionData.servicePaidFor,
    amount: transactionData.amount,
    status: TransactionStatusEnum.SUCCESS,
    paymentReference: await PaymentContollers.generateReference(),
    transactionReference: transactionData.transactionReference,
    metadata: {
      paymentDescription: transactionData.paymentDescription,
      customer: transactionData.customerName,
      paymentStatus: TransactionStatusEnum.SUCCESS,
    },
  });
const saved = transaction.save()
if (saved instanceof Error) {
    throw new AppError("Transaction could not be saved from debit wallet", 500);
}
  return wallet;
}



  // Freeze Wallet
public async freezeWallet(email: string): Promise<IWallet | Error> {
  const wallet = await this.getWallet(email);

  if (!wallet) {
    return new Error("Wallet not found for the provided email.");
  }

  if (wallet.status === 'suspended') {
    return new Error("Wallet is already suspended.");
  }

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
