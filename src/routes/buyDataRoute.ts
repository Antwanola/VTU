import express from 'express';
import { DataCntroller } from '../controllers/dataController';
import { authController } from '../controllers/authController';


const dataContollerRoute = express.Router();

const dataCntroller = new DataCntroller();



dataContollerRoute.post('/buy-data',authController.authenticationToken, dataCntroller.buyData);
dataContollerRoute.post('/find-data', authController.authenticationToken, dataCntroller.findData);

export default dataContollerRoute;