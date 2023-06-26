import {Router } from 'express'
import { login, register,getUsers, editUser,deleteUser } from '../controllers/userController.js'
import { allowAccess, verifyToken } from '../middleware/auth.js'

const userRouter = Router()

userRouter.get('/',getUsers)
userRouter.put('/:id',editUser)
userRouter.delete('/:id',deleteUser)
userRouter.post("/login",login)
userRouter.post("/register",register)
userRouter.get("/test",verifyToken,allowAccess(["user"]),(req,res)=>{
    res.json({message:"verify token is working"})
})

export default userRouter