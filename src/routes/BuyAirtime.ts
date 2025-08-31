import express from "express";
import { buyGSubzAirtime } from "../controllers/Gsubz_Airtime_Controller";
import { authController } from "../controllers/authController";


const BuyAirtimeRoute = express.Router();

BuyAirtimeRoute.post('/buy-airtime', authController.authenticationToken, buyGSubzAirtime.buyAirtime);

export default BuyAirtimeRoute;