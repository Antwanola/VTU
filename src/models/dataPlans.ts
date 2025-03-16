import { Schema, model, Document } from 'mongoose';

interface IData extends Document {
  sku: string,
  networkProvider: string;
  plan?: string;
  duration?: string;
  price?: number;
  setBy?: string;
}

const DataSchema = new Schema<IData>({
  networkProvider: { type: String, required: true },
  sku: { type: String, require: true },
  plan: { type: String },
  duration: { type: String},
  price: { type: Number},
  setBy: { type: String, required: true },
});

export const Data = model<IData>('Data', DataSchema);