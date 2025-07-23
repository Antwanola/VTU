import express from 'express';
import { DataCntroller } from '../controllers/GladTidingsDataController';
import { gsubzDataController } from '../controllers/GsubzDataController';
import { authController } from '../controllers/authController';


const dataContollerRoute = express.Router();

const dataCntroller = new DataCntroller();



dataContollerRoute.post('/buy-data',authController.authenticationToken, dataCntroller.buyData);
dataContollerRoute.post('/find-data', authController.authenticationToken, dataCntroller.findData);

dataContollerRoute.post('/findgSubz-data',  gsubzDataController.findGsubzData);
dataContollerRoute.post('/buy-gsubz-data', authController.authenticationToken, gsubzDataController.buyGsubzData);



export default dataContollerRoute;