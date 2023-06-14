import {Router } from 'express'
import { login, register } from '../controllers/userController.js'
import { allowAccess, verifyToken } from '../middleware/auth.js'

const userRouter = Router()


userRouter.post("/login",login)
userRouter.post("/register",register)
userRouter.get("/test",verifyToken,allowAccess(["user"]),(req,res)=>{
    res.json({message:"verify token is working"})
})

export default userRouter