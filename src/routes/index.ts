import express from "express"
import authRouter from "./authRoutes"
import paymentRouter from "./payment"

const router = express.Router()

router.use('/api/v1', authRouter )
router.use('/api/v1', paymentRouter )


export default router;