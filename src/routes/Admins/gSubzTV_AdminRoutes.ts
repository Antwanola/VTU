import express from 'express';
import { authController } from '../../controllers/authController';
import { gSubzTvService } from '../../services/TV_Services';

import { gSubzCableTV } from '../../controllers/GSubzTVController';



const TVRouter = express.Router();


TVRouter.post('/find-cable-tv',  authController.authenticationToken, authController.isAdmin, gSubzCableTV.findAllGSubzTVPackage);
TVRouter.post('/edit-cabletv', authController.authenticationToken, authController.isAdmin,gSubzCableTV.editOneInternalCableTV  );


export default TVRouter;