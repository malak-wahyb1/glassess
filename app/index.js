import { Router  } from "express";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import saleRouter from "./routes/salesRoute.js";
import customerRouter from "./routes/customerRoute.js";
import supplierRoute from "./routes/suplierRoute.js";
import ProductInfoRoute from "./routes/productInfoRoute.js";
import cors from'cors'
const router = Router();

router.get("/test", (req, res) => {
    res.send("Api is working fine")
})
router.use(cors())
router.use("/user", userRouter)
router.use('/product', productRouter)
router.use('/sale', saleRouter)
router.use('/customer', customerRouter)
router.use('/supplier', supplierRoute)
router.use('/productInfo',ProductInfoRoute)

export default router