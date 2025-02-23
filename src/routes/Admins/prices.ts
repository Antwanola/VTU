import express from 'express';
import { newDataPrice } from '../../controllers/AdminController/priceController';
import { authController } from '../../controllers/authController';

const priceRouter = express.Router();

// Set price for a specific network provider and bundle type (admin only)
priceRouter.post('/post-price', authController.authenticationToken, authController.isAdmin, newDataPrice.PostPrice );
priceRouter.put('/update-price', authController.authenticationToken, authController.isAdmin, newDataPrice.updatePrice );
priceRouter.get('/get-prices/:networkProvider', authController.authenticationToken, authController.isAdmin, newDataPrice.getAllPrices );
priceRouter.get('/get-data/:networkProvider', authController.authenticationToken, authController.isAdmin, newDataPrice.allData)



export default priceRouter;
