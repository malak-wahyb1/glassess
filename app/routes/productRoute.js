import { getProduct,getProducts,createProduct,editProduct,deleteProduct } from '../controllers/productController.js';
import {Router } from 'express'
const ProductRouter=Router();
ProductRouter.get('/',getProducts)
ProductRouter.get('/:id',getProduct)
ProductRouter.post('/',createProduct)
ProductRouter.put('/:id',editProduct)
ProductRouter.delete('/:id',deleteProduct)
export default ProductRouter