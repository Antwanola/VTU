import mongoose, { Document, Schema, Types } from 'mongoose';
import { Transaction, ITransaction } from './transactions';
import { IUser } from './users';

// Interface for the base Wallet document
interface IWallet {
    user: Types.ObjectId;
    balance: number;
    ledgerBalance: number;
    status: 'active' | 'suspended';
    transactions: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

// Interface for Wallet document with Mongoose methods
interface IWalletDocument extends IWallet, Document {
    // Add custom instance methods here if needed
}

// Schema definition
const walletSchema = new Schema<IWalletDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        ledgerBalance: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ['active', 'suspended'],
            default: 'active',
            required: true,
        },
        transactions: [{
            type: Schema.Types.ObjectId,
            ref: 'Transaction',
        }],
    },
    {
        timestamps: true,
    }
);

// Indexes
walletSchema.index({ user: 1 });
walletSchema.index({ status: 1 });

// Model type with TypeScript generics
const Wallet = mongoose.model<IWalletDocument>('Wallet', walletSchema);

// Type for populating references
interface PopulatedWallet extends Omit<IWallet, 'user' | 'transactions'> {
    user: Types.ObjectId | IUser; // Replace IUser with your User interface
    transactions: Types.ObjectId[] | ITransaction[]; // Replace ITransaction with your Transaction interface
}

export { IWallet, IWalletDocument, PopulatedWallet };
export default Wallet;