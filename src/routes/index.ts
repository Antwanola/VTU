import express from "express"
import authRouter from "./authRoutes"
import paymentRouter from "./payment"
import dataContollerRoute from "./buyDataRoute"
import quickTellerRouter from "./quictellerRoutes"

const router = express.Router()

router.use('/api/v1', authRouter )
router.use('/api/v1', paymentRouter )
router.use('/api/v1', dataContollerRoute )
router.use('/api/v1', quickTellerRouter)

//Admin Router
import priceRouter from "./Admins/prices"
router.use('/api/v1/admin', priceRouter)


export default router;