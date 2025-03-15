import express from 'express';
import { newDataPrice } from '../../controllers/AdminController/adminDataController';
import { authController } from '../../controllers/authController';

const dataRoute = express.Router();

// Set price for a specific network provider and bundle type (admin only)
dataRoute.post('/create-data', authController.authenticationToken, authController.isAdmin, newDataPrice.createData );
dataRoute.put('/update-data', authController.authenticationToken, authController.isAdmin, newDataPrice.updateData );
dataRoute.post('/post-data/:networkProvider', authController.authenticationToken, authController.isAdmin, newDataPrice.getNetworkData );
dataRoute.get('/get-all-data', authController.authenticationToken, authController.isAdmin, newDataPrice.allData)



export default dataRoute;
