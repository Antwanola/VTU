import { dataService } from './../services/gladtidings';
import express from "express"
import authRouter from "./authRoutes"
import paymentRouter from "./payment"
import dataContollerRoute from "./buyDataRoute"
import quickTellerRouter from "./quictellerRoutes"
//Admin Router
import dataRoute from "./Admins/dataCreateRoute"

const router = express.Router()

router.use('/api/v1', authRouter )
router.use('/api/v1', paymentRouter )
router.use('/api/v1', dataContollerRoute)
router.use('/api/v1', quickTellerRouter)


router.use('/api/v1/admin', dataRoute)


export default router;