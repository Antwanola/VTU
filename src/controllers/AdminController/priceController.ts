import { Request, Response, NextFunction } from 'express';
import { Price } from '../../models/dataPrice';
import { Data } from '../../models/dataPlans';
import { AppError } from '../../utils/HandleErrors';

class DataPrice {
    
    constructor() {}

    public PostPrice = async ( req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
              const { networkProvider, bundleType, price } = req.body;
            
              // Check if the data plan exists
              const data = await Data.findOne({ networkProvider, bundleType });
              if (!data) {
                return res.status(404).json({ message: 'Data plan not found' });
              }
              // Check if a price already exists for this combination
              const existingPrice = await Price.findOne({ networkProvider, bundleType });
              console.log({existingPrice})
              if (existingPrice) {
                return res.status(400).json({ message: 'Price already exists for this combination' });
              }
            
              // Create a new price
              const newPrice = new Price({ networkProvider, bundleType, price, setByAdmin: true });
              await newPrice.save();
              res.status(201).json(newPrice);
        } catch (error: any) {
            next(error)
        }
    }


    // Update price for a specific network provider and bundle type (admin only)
public updatePrice = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { networkProvider, bundleType, price } = req.body;

    // Find and update the price
    const updatedPrice = await Price.findOneAndUpdate(
      { networkProvider, bundleType },
      { price },
      { new: true }
    );
  
    if (!updatedPrice) {
      return res.status(404).json({ message: 'Price not found' });
    }
  
    res.status(200).json({status: 'success', updatedPrice});
  } catch (error: any) {
    next(error);
  }
}

// Get all prices for a specific network provider
public getAllPrices =  async (req: Request, res: Response): Promise<void> => {
  try {
    const { networkProvider } = req.params
 
    const prices = await Price.find({ networkProvider })
    if (!prices) {
      throw new AppError("prices not found", 404)
    }
    res.json(prices);
  } catch (error: any) {
    res.status(404).send(error.message)
  }
}

//Get all data
public allData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { networkProvider } = req.params;
    const data = await Data.find({ networkProvider })
    if(!data) {
      throw new AppError("ata not found", 404)
    }
    res.json(data)
  } catch (error: any) {
    res.json(error.message)
  }
}
}



export const newDataPrice = new DataPrice();