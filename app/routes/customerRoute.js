import { getCustomer,getCustomers,createCustomer,editCustomer,deleteCustomer } from "../controllers/customersController.js";
import {Router } from 'express'
const CustomerRouter=Router();

CustomerRouter.get('/',getCustomers)
CustomerRouter.get('/:id',getCustomer)
CustomerRouter.post('/',createCustomer)
CustomerRouter.put('/:id',editCustomer)
CustomerRouter.delete('/:id',deleteCustomer)
export default CustomerRouter


