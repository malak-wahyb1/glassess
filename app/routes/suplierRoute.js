
import {Router } from 'express'
import { createSupplier, deleteSupplier, editSupplier, getLastFiveSuppliers, getSupplier, getSuppliers } from '../controllers/ supliersController.js';
const SupplierRouter=Router();

SupplierRouter.get('/',getSuppliers)
SupplierRouter.get('/last',getLastFiveSuppliers)

SupplierRouter.get('/:id',getSupplier)
SupplierRouter.post('/',createSupplier)
SupplierRouter.put('/:id',editSupplier)
SupplierRouter.delete('/:id',deleteSupplier)
export default SupplierRouter


