
import {Router } from 'express'
import { createSupplier, deleteSupplier, editSupplier, getSupplier, getSuppliers } from '../controllers/ supliersController.js';
const SupplierRouter=Router();

SupplierRouter.get('/',getSuppliers)
SupplierRouter.get('/:id',getSupplier)
SupplierRouter.post('/',createSupplier)
SupplierRouter.put('/:id',editSupplier)
SupplierRouter.delete('/:id',deleteSupplier)
export default SupplierRouter


