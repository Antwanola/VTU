import { gSubzCableTV } from '../controllers/GSubzTVController';
import { authController } from '../controllers/authController';
import express from 'express'


const userTVroute = express.Router();

userTVroute.post('/buy-tv-subscription', authController.authenticationToken, gSubzCableTV.BUYCABLETV );

export default userTVroute;