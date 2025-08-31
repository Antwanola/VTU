import { dataService } from '../services/VTU_data/gladtidings';
import express from "express"
import authRouter from "./authRoutes"
import paymentRouter from "./payment"
import dataContollerRoute from "./buyGladTingsDataRoute"

//Admin Router
import dataRoute from "./Admins/dataCreateRoute"
import userAdminRoute from './Admins/userAdminOperations';
import BuyAirtimeRoute from './BuyAirtime';

const router = express.Router()

router.use('/api/v1', authRouter )
router.use('/api/v1', paymentRouter )
router.use('/api/v1', dataContollerRoute)
router.use('/api/v1', BuyAirtimeRoute)


router.use('/api/v1/admin', dataRoute)
router.use('/api/v1/admin', userAdminRoute)



export default router;