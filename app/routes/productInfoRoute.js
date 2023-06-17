import { Router } from "express";
import {
  createProductInfo,
  deleteProductInfo,
  editProductInfo,
  getProductInfo,
} from "../controllers/productIndoController.js";
const ProductInfoRoute = Router();

ProductInfoRoute.get("/:id", getProductInfo);
ProductInfoRoute.post("/", createProductInfo);
ProductInfoRoute.put("/:id", editProductInfo);
ProductInfoRoute.delete("/:id", deleteProductInfo);
export default ProductInfoRoute;
