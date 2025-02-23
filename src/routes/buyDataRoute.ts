import express from 'express';
import { DataCntroller } from '../controllers/dataController';


const dataContollerRoute = express.Router();

const dataCntroller = new DataCntroller();



dataContollerRoute.post('/buy-data', dataCntroller.buyData);

export default dataContollerRoute;