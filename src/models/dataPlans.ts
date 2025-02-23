import { Schema, model, Document } from 'mongoose';

interface IData extends Document {
  networkProvider: string;
  plan: string;
}

const DataSchema = new Schema<IData>({
  networkProvider: { type: String, required: true },
  plan: { type: String, required: true },
});

export const Data = model<IData>('Data', DataSchema);