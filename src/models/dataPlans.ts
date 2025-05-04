import { Schema, model,Types,  Document } from 'mongoose';


interface IData extends Document {
  sku: string,
  networkProvider: string;
  plan?: string;
  duration?: string;
  price?: number;
  serviceType?: Types.ObjectId;
  setBy?: string;
  createdAt?: Date;
}

const DataSchema = new Schema<IData>({
  networkProvider: { type: String, required: true },
  sku: { type: String, require: true },
  plan: { type: String },
  duration: { type: String },
  price: { type: Number },
  serviceType: { type: Schema.Types.ObjectId, ref: 'ServiceType' },
  createdAt: { type: Date, default: Date.now },
  setBy: { type: String, required: true },
});

DataSchema.pre('save', function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

export const Data = model<IData>('Data', DataSchema);