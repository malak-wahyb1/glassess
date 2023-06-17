import { getProduct,getProducts,createProduct,editProduct,deleteProduct, All } from '../controllers/productController.js';
import {Router } from 'express'
const ProductRouter=Router();
ProductRouter.get('/',getProducts)
ProductRouter.get('/all',All)

ProductRouter.get('/:id',getProduct)
ProductRouter.post('/',createProduct)
ProductRouter.put('/:id',editProduct)
ProductRouter.delete('/:id',deleteProduct)
export default ProductRouter