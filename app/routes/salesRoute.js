import {Router } from 'express'
import { createSale, deleteSale, editSale, getLastFiveItems, getSale, getSales } from '../controllers/salesController.js';
const SalesRouter=Router();

SalesRouter.get('/',getSales)
SalesRouter.get('/All',getLastFiveItems)

SalesRouter.get('/:id',getSale)
SalesRouter.post('/',createSale)
SalesRouter.put('/:id',editSale)
SalesRouter.delete('/:id',deleteSale)
export default SalesRouter