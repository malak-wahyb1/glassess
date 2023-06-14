import { Router  } from "express";
import userRouter from "./routes/userRoute.js";

const router = Router();

router.get("/test", (req, res) => {
    res.send("Api is working fine")
})
router.use("/user", userRouter)

export default router