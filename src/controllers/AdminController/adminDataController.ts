import { UserRequest } from '../../utils/types';
import { Request, Response, NextFunction } from 'express';
import { Data } from '../../models/dataPlans';
import { AppError } from '../../utils/HandleErrors';
import { logger } from '../../utils/logger';
import { DBdataSet } from '../../utils/types/db_Data_set';
class DataPrice {
    
    constructor() {}

    public createData = async ( req: UserRequest, res: Response, next: NextFunction): Promise<any> => {
      let num = 100
      const ID = () => {
        return `SKU_${num++}`
      }
        try {
              const { networkProvider, plan, price, duration }: DBdataSet = req.body;
              const who = req.user.role
            
              // Check if the data plan exists
              const data: any = await Data.findOne({ networkProvider, plan });
              if ( data !== null ) {
                throw new AppError('Data plan already exists', 400);
              }

              // Create a new data
              const newData = new Data({ networkProvider, plan, price, duration, setBy: who, sku:ID()});
              const saved = await newData.save();
              if(!saved){
                throw new AppError("New data not created")
              }
              res.status(201).json(newData);
        } catch (error: any) {
          logger.error({error: error.message});
          res.json({error: error.message});
        }
    }


    // Update price for a specific network provider and bundle type (admin only)
public updateData = async (req: UserRequest, res: Response, next: NextFunction): Promise<any> => {
  let num = 100
  const ID = () => {
    return `SKU_${++num}`
  }
  try {
    const { networkProvider, plan, price, duration }: DBdataSet = req.body;
    const update: DBdataSet = {
      networkProvider,
      sku: ID(),
      plan,
      price,  
      duration,
      setBy: req.user.role
    }

    // Find and update the price
    const updateData = await Data.findOneAndUpdate(
      { networkProvider, plan },
      { $set: update },
      { new: true }
    );
  
    if (!updateData) {
      throw new AppError('Data plan not found. Please create one', 404);
    }
    const updateSatus = updateData? true : false;
  
    res.status(200).json({status: updateSatus, updateData});
  } catch (error: any) {
    logger.error({error: error.message});
    res.json({error: error.message});
  }
}

// Get all prices for a specific network provider
public getNetworkData =  async (req: Request, res: Response): Promise<void> => {
  try {
    const { networkProvider } = req.params
    console.log(networkProvider)
    const data = await Data.find({ networkProvider })
    if (!data) {
      throw new AppError("Data not found", 404)
    }
    res.json(data);
  } catch (error: any) {
    res.status(404).json(error.message)
  }
}

//Get all data
public allData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await Data.find()
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