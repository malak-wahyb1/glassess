import { getCustomer,getCustomers,createCustomer,editCustomer,deleteCustomer, GetAll, getLastFiveCustomers } from "../controllers/customersController.js";
import {Router } from 'express'
const CustomerRouter=Router();

CustomerRouter.get('/',getCustomers)
CustomerRouter.get('/all',GetAll)
CustomerRouter.get('/last',getLastFiveCustomers)

CustomerRouter.get('/:id',getCustomer)
CustomerRouter.post('/',createCustomer)
CustomerRouter.put('/:id',editCustomer)
CustomerRouter.delete('/:id',deleteCustomer)
export default CustomerRouter


